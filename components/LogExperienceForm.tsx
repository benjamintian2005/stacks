'use client';

import { useState } from 'react';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { X, Loader2 } from 'lucide-react';
import { logExperience } from '@/lib/actions/experiences';

type PendingPhoto = {
  key: string;
  previewUrl: string;
  uploadedUrl?: string;
  error?: string;
};

const today = () => new Date().toISOString().slice(0, 10);

export default function LogExperienceForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [experiencedAt, setExperiencedAt] = useState(today());
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const key = `${file.name}-${Date.now()}-${Math.random()}`;
      const previewUrl = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, { key, previewUrl }]);

      upload(file.name, file, { access: 'public', handleUploadUrl: '/api/upload' })
        .then((blob) => {
          setPhotos((prev) => prev.map((p) => (p.key === key ? { ...p, uploadedUrl: blob.url } : p)));
        })
        .catch((err: Error) => {
          setPhotos((prev) => prev.map((p) => (p.key === key ? { ...p, error: err.message } : p)));
        });
    });
  };

  const removePhoto = (key: string) => {
    setPhotos((prev) => prev.filter((p) => p.key !== key));
  };

  const uploading = photos.some((p) => !p.uploadedUrl && !p.error);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (uploading) {
      setFormError('Wait for photos to finish uploading');
      return;
    }

    setIsSubmitting(true);
    const result = await logExperience({
      title,
      description,
      location,
      experiencedAt,
      photoUrls: photos.filter((p) => p.uploadedUrl).map((p) => p.uploadedUrl!),
    });
    if (result?.error) {
      setFormError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Hiked Angels Landing"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="experiencedAt" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Date
          </label>
          <input
            id="experiencedAt"
            type="date"
            value={experiencedAt}
            onChange={(e) => setExperiencedAt(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Location (optional)
          </label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Zion National Park"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Photos</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700 dark:text-slate-300"
        />
        {photos.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {photos.map((photo) => (
              <div key={photo.key} className="relative aspect-square overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                <Image src={photo.previewUrl} alt="" fill sizes="150px" className="object-cover" unoptimized />
                {!photo.uploadedUrl && !photo.error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
                {photo.error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/70 p-1 text-center text-[10px] text-white">
                    Failed
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.key)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Logging…' : uploading ? 'Uploading photos…' : 'Log experience'}
      </button>
    </form>
  );
}
