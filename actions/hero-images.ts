'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage, deleteImage } from '@/actions/upload';

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

export async function createHeroImage(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const page = (formData.get('page') as string) || 'home';
    const alt  = (formData.get('alt')  as string) || '';

    const uploaded = await uploadImage(formData, 'hero');

    const maxOrder = await prisma.heroImage.aggregate({
      where: { page },
      _max:  { order: true },
    });

    await prisma.heroImage.create({
      data: {
        url:      uploaded.url,
        publicId: uploaded.publicId,
        alt,
        page,
        order:    (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath('/');
    revalidatePath('/company');
    revalidatePath('/dashboard/hero-images');
    return { success: true };
  } catch (err) {
    console.error('[createHeroImage]', err);
    return { success: false, error: 'Upload failed. Please try again.' };
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
