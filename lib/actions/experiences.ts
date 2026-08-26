'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';

type LogExperienceInput = {
  title: string;
  description?: string;
  location?: string;
  experiencedAt: string; // yyyy-mm-dd
  photoUrls: string[];
};

export async function logExperience(input: LogExperienceInput) {
  const userId = await requireUserId();

  const title = input.title.trim();
  if (!title) {
    return { error: 'Title is required' };
  }

  const experience = await getDb().experience.create({
    data: {
      userId,
      title,
      description: input.description?.trim() || undefined,
      location: input.location?.trim() || undefined,
      experiencedAt: new Date(input.experiencedAt),
      photos: {
        create: input.photoUrls.map((url, position) => ({ url, position })),
      },
    },
  });

  await getDb().activityEvent.create({
    data: { actorId: userId, eventType: 'LOGGED_EXPERIENCE', experienceId: experience.id },
  });

  revalidatePath('/');
  revalidatePath('/feed');
  redirect(`/experience/${experience.id}`);
}

export async function deleteExperience(experienceId: string) {
  const userId = await requireUserId();

  await getDb().experience.deleteMany({ where: { id: experienceId, userId } });

  revalidatePath('/');
  revalidatePath('/feed');
  redirect('/');
}
