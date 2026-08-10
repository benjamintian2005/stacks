import { cache } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDb } from './db';

export const getCurrentUserId = cache(async () => {
  const { userId } = await auth();
  return userId;
});

export const getCurrentProfile = cache(async () => {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  return getDb().profile.findUnique({ where: { id: userId } });
});

export async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/sign-in');
  return userId;
}

/** Redirects to /welcome if the signed-in Clerk user has no Profile row yet. */
export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/welcome');
  return profile;
}
