import { materials as fallbackMaterials, modules as fallbackModules } from '@/lib/course-data';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import type { Material, SessionStatus } from '@/lib/types';

function courseMaterialPriority(material: Material) {
  if (material.title === 'DATA301 Course Overview') return 0;
  if (material.moduleSlug === 'supervised-learning') return 1;
  if (material.moduleSlug === 'introduction-and-data') return 2;
  return 3;
}

function orderCourseMaterials(items: Material[]) {
  return [...items].sort((a, b) => {
    const priorityDifference = courseMaterialPriority(a) - courseMaterialPriority(b);
    if (priorityDifference) return priorityDifference;
    const timeA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const timeB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return timeB - timeA || a.title.localeCompare(b.title);
  });
}

function materialSeriesKey(material: Material) {
  return [
    material.moduleSlug ?? 'course',
    material.sessionNumber ?? 'all',
    material.title.trim().toLowerCase(),
  ].join('::');
}

function latestPublishedMaterials(items: Material[]) {
  const latest = new Map<string, Material>();

  for (const item of items) {
    const key = materialSeriesKey(item);
    const current = latest.get(key);
    const itemTime = item.publishedAt ? Date.parse(item.publishedAt) : 0;
    const currentTime = current?.publishedAt ? Date.parse(current.publishedAt) : 0;

    if (
      !current
      || item.version > current.version
      || (item.version === current.version && itemTime >= currentTime)
    ) {
      latest.set(key, item);
    }
  }

  return [...latest.values()].sort((a, b) => {
    const timeA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const timeB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return timeB - timeA || a.title.localeCompare(b.title);
  });
}

export async function getPublishedModules() {
  if (!isSupabaseConfigured) return fallbackModules;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('status', 'published')
    .order('position');

  if (error || !data?.length) return fallbackModules;

  // The official module details remain source-controlled. Database rows currently
  // control publication state and ordering, while richer lesson structure stays
  // typed in course-data.ts until a full module editor is introduced.
  const publishedSlugs = new Set(data.map((item) => item.slug));
  return fallbackModules.filter((module) => publishedSlugs.has(module.slug));
}

export async function getPublishedMaterials(): Promise<Material[]> {
  if (!isSupabaseConfigured) return orderCourseMaterials(latestPublishedMaterials(fallbackMaterials));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('materials_public')
    .select('*')
    .order('published_at', { ascending: false });

  if (error || !data?.length) {
    // The source package includes local fallback files for development and recovery,
    // but Vercel intentionally excludes them so course files are served only from
    // the private Supabase bucket. Never emit dead static links in production.
    return process.env.VERCEL ? [] : orderCourseMaterials(latestPublishedMaterials(fallbackMaterials));
  }

  const databaseMaterials: Material[] = data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    kind: item.kind,
    moduleSlug: item.module_slug ?? undefined,
    sessionNumber: item.session_number ?? undefined,
    href: `/api/materials/${item.id}`,
    fileName: item.file_name,
    format: item.format,
    sizeLabel: item.size_label ?? '',
    status: item.status,
    publishedAt: item.published_at ?? undefined,
    version: item.version,
    thumbnail: item.thumbnail_url ?? undefined,
  }));

  return orderCourseMaterials(latestPublishedMaterials(process.env.VERCEL ? databaseMaterials : [...fallbackMaterials, ...databaseMaterials]));
}

export async function getCourseSessionStatuses(): Promise<Record<number, SessionStatus>> {
  if (!isSupabaseConfigured) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('number,status')
    .order('number');

  if (error || !data?.length) return {};

  return Object.fromEntries(
    data.map((session) => [Number(session.number), session.status as SessionStatus]),
  );
}
