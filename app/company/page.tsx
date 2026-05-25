import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import CompanyHero   from './_components/CompanyHero';
import OurStory      from './_components/OurStory';
import TheProblem    from './_components/TheProblem';
import FoundingIdea  from './_components/FoundingIdea';
import OurJourney    from './_components/OurJourney';
import MissionVision from './_components/MissionVision';
import PartnersStrip from './_components/PartnersStrip';
import Team, { TeamMember } from '@/components/Team';
import { prisma } from '@/lib/prisma';
import { getHeroImages } from '@/actions/hero-images';

export const metadata: Metadata = {
  title: 'Company',
  description:
    'Learn about Geuza — our mission to transform e-waste into affordable assistive devices, our vision for an inclusive Africa, and the team making it happen.',
};

export default async function CompanyPage() {
  const [companyHeroImages, rawEmployees, rawPartners] = await Promise.all([
    getHeroImages('company'),
    prisma.employee.findMany({
      where: { isVisible: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.partner.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, logo: true, website: true },
    }),
  ]);

  const members: TeamMember[] = rawEmployees.map((e) => ({
    id:     e.id,
    name:   e.name,
    role:   e.role,
    avatar: e.avatar,
  }));

  return (
    <>
      <Header />
      <main>
        <CompanyHero images={companyHeroImages.map((i) => ({ url: i.url, alt: i.alt }))} />
        <OurStory />
        <TheProblem />
        <FoundingIdea />
        <OurJourney />
        <MissionVision />
        <Team members={members} />
        <PartnersStrip partners={rawPartners} />
      </main>
      <Footer />
    </>
  );
}
