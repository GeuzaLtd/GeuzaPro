import { getPartners } from '@/actions/partners';
import PartnersView from './_components/PartnersView';

export default async function PartnersPage() {
  const raw = await getPartners();
  const data = raw.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type ?? null,
    contact: p.contactName ?? null,
    email: p.contactEmail ?? null,
    phone: p.contactPhone ?? null,
    country: p.country ?? null,
    status: p.isVisible ? 'Active' : 'Inactive',
    since: p.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    description: p.description ?? null,
    logo: p.logo ?? null,
  }));
  return <PartnersView initialData={data} />;
}
