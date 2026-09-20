import type { MetadataRoute } from 'next';
import { modules } from '@/lib/course-data';
import { topics } from '@/lib/topic-data';
import { getSiteUrl } from '@/lib/site-url';
import { labs } from '@/lib/labs-data';
import { projectBriefs } from '@/lib/project-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticRoutes = ['', '/course', '/learn', '/labs', '/projects', '/resources', '/about', '/search'];
  const labRoutes = labs.map((lab) => lab.href);
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: route === '' || route === '/resources' ? 'weekly' as const : 'monthly' as const,
      priority: route === '' ? 1 : .8,
    })),
    ...labRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: .75,
    })),
    ...modules.map((module) => ({
      url: `${base}/learn/module/${module.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: .85,
    })),
    ...projectBriefs.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: .72,
    })),
    ...['public-course-guide', 'public-lab-guide', 'public-module-2-guide'].map((id) => ({
      url: `${base}/resources/read/${id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: .68,
    })),
    ...topics.map((topic) => ({
      url: `${base}/topics/${topic.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: .8,
    })),
  ];
}
