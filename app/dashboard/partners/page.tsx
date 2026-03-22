import { getPartners } from '@/actions/partners';
import PartnersView from './_components/PartnersView';

export default async function PartnersPage() {
  const raw = await getPartners();
  const data = raw.map((p) => ({
    id: p.id,
    name: p.name,
    type: null as string | null,
    contact: p.contactName ?? null,
    email: p.contactEmail ?? null,
    phone: null as string | null,
    country: null as string | null,
    status: p.isVisible ? 'Active' : 'Inactive',
    since: p.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    description: p.description ?? null,
  }));
  return <PartnersView initialData={data} />;
}
