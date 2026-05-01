import { getAllHeroImages } from '@/actions/hero-images';
import HeroImagesView from './_components/HeroImagesView';

export default async function HeroImagesPage() {
  const images = await getAllHeroImages();
  return <HeroImagesView images={images} />;
}
