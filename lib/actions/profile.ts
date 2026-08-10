'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(20, 'At most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only'),
  displayName: z.string().max(50).optional(),
});

export type CreateProfileInput = z.infer<typeof usernameSchema>;
export type CreateProfileResult = { error: string } | { error?: undefined };

export async function createProfile(input: CreateProfileInput): Promise<CreateProfileResult> {
  const userId = await requireUserId();
  const parsed = usernameSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const existing = await getDb().profile.findUnique({ where: { username: parsed.data.username } });
  if (existing) {
    return { error: 'That username is already taken' };
  }

  await getDb().profile.create({
    data: {
      id: userId,
      username: parsed.data.username,
      displayName: parsed.data.displayName || parsed.data.username,
    },
  });

  redirect('/');
}

const updateProfileSchema = z.object({
  displayName: z.string().max(50).optional(),
  bio: z.string().max(300).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateProfile(input: UpdateProfileInput): Promise<CreateProfileResult> {
  const userId = await requireUserId();
  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  await getDb().profile.update({
    where: { id: userId },
    data: {
      displayName: parsed.data.displayName || null,
      bio: parsed.data.bio || null,
    },
  });

  return {};
}
