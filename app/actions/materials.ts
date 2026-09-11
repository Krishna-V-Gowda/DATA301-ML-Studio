'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireStaff } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

const IdSchema = z.string().uuid();

export async function publishMaterial(formData: FormData) {
  await requireStaff();
  const id = IdSchema.parse(formData.get('id'));
  const supabase = await createClient();
  const { data: material, error: lookupError } = await supabase
    .from('materials')
    .select('course_id,module_slug,session_number')
    .eq('id', id)
    .maybeSingle();
  if (lookupError || !material) throw new Error(lookupError?.message ?? 'Material not found.');

  const { error } = await supabase
    .from('materials')
    .update({ status: 'published', publish_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);

  if (material.module_slug && material.session_number) {
    const { error: sessionError } = await supabase
      .from('sessions')
      .update({ status: 'published' })
      .eq('course_id', material.course_id)
      .eq('module_slug', material.module_slug)
      .eq('number', material.session_number)
      .neq('status', 'completed');
    if (sessionError) {
      console.error(`Material published, but the session status could not be updated: ${sessionError.message}`);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/materials');
  revalidatePath('/admin/review');
  revalidatePath('/resources');
  revalidatePath('/search');
  revalidatePath('/learn', 'layout');
}

export async function archiveMaterial(formData: FormData) {
  await requireStaff();
  const id = IdSchema.parse(formData.get('id'));
  const supabase = await createClient();
  const { error } = await supabase.from('materials').update({ status: 'archived' }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/materials');
  revalidatePath('/admin/review');
  revalidatePath('/resources');
  revalidatePath('/search');
  revalidatePath('/learn', 'layout');
}
