import { getTestimonials } from '@/actions/testimonials';
import TestimonialsView from './_components/TestimonialsView';

export default async function TestimonialsPage() {
  const raw = await getTestimonials();
  const data = raw.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role ?? null,
    organization: t.company ?? null,
    quote: t.quote,
    rating: t.rating ?? 5,
    status: t.isVisible ? 'Published' : 'Draft',
    date: t.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    featured: t.featured,
    avatar: t.avatar ?? null,
  }));
  return <TestimonialsView initialData={data} />;
}
