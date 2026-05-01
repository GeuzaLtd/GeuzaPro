'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { deleteImage } from '@/actions/upload';
import cloudinary from '@/lib/cloudinary';

export type HeroImageItem = {
  id:        number;
  url:       string;
  publicId:  string;
  alt:       string;
  page:      string;
  isVisible: boolean;
  order:     number;
};

export async function getHeroImages(page?: string): Promise<HeroImageItem[]> {
  return prisma.heroImage.findMany({
    where: page ? { page, isVisible: true } : { isVisible: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function getAllHeroImages(): Promise<HeroImageItem[]> {
  return prisma.heroImage.findMany({
    orderBy: [{ page: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
  });
}

// Returns auth params so the client can POST the file directly to Cloudinary,
// bypassing Next.js body size limits entirely.
export async function getCloudinarySignature(): Promise<{
  signature:  string;
  timestamp:  number;
  folder:     string;
  apiKey:     string;
  cloudName:  string;
}> {
  const timestamp = Math.round(Date.now() / 1000);
  const folder    = 'hero';
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );
  return {
    signature,
    timestamp,
    folder,
    apiKey:    process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  };
}

// Called after the client has already uploaded to Cloudinary — just saves the record.
export async function saveHeroImageRecord(data: {
  url:      string;
  publicId: string;
  alt:      string;
  page:     string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const maxOrder = await prisma.heroImage.aggregate({
      where: { page: data.page },
      _max:  { order: true },
    });
    await prisma.heroImage.create({
      data: {
        url:      data.url,
        publicId: data.publicId,
        alt:      data.alt,
        page:     data.page,
        order:    (maxOrder._max.order ?? -1) + 1,
      },
    });
    revalidatePath('/');
    revalidatePath('/company');
    revalidatePath('/dashboard/hero-images');
    return { success: true };
  } catch (err) {
    console.error('[saveHeroImageRecord]', err);
    return { success: false, error: 'Failed to save image record.' };
  }
}

export async function deleteHeroImage(id: number): Promise<void> {
  const image = await prisma.heroImage.findUnique({ where: { id } });
  if (!image) return;

  if (image.publicId) {
    await deleteImage(image.publicId).catch((e) => console.error('[deleteHeroImage cloudinary]', e));
  }

  await prisma.heroImage.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/company');
  revalidatePath('/dashboard/hero-images');
}

export async function toggleHeroImageVisibility(id: number, isVisible: boolean): Promise<void> {
  await prisma.heroImage.update({ where: { id }, data: { isVisible } });
  revalidatePath('/');
  revalidatePath('/company');
  revalidatePath('/dashboard/hero-images');
}

export async function updateHeroImageAlt(id: number, alt: string): Promise<void> {
  await prisma.heroImage.update({ where: { id }, data: { alt } });
  revalidatePath('/dashboard/hero-images');
}

export async function moveHeroImage(id: number, direction: 'up' | 'down'): Promise<void> {
  const image = await prisma.heroImage.findUnique({ where: { id } });
  if (!image) return;

  const neighbour = await prisma.heroImage.findFirst({
    where: {
      page:  image.page,
      order: direction === 'up' ? { lt: image.order } : { gt: image.order },
    },
    orderBy: { order: direction === 'up' ? 'desc' : 'asc' },
  });

  if (!neighbour) return;

  await prisma.$transaction([
    prisma.heroImage.update({ where: { id: image.id },     data: { order: neighbour.order } }),
    prisma.heroImage.update({ where: { id: neighbour.id }, data: { order: image.order } }),
  ]);

  revalidatePath('/');
  revalidatePath('/company');
  revalidatePath('/dashboard/hero-images');
}
