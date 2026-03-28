import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import CompanyHero  from './_components/CompanyHero';
import OurStory    from './_components/OurStory';
import TheProblem  from './_components/TheProblem';
import FoundingIdea from './_components/FoundingIdea';
import OurJourney  from './_components/OurJourney';
import MissionVision from './_components/MissionVision';
import Team, { TeamMember } from '@/components/Team';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Company | Geuza',
  description:
    'Learn about Geuza — our mission to transform e-waste into affordable assistive devices, our vision for an inclusive Africa, and the team making it happen.',
};

export default async function CompanyPage() {
  const rawEmployees = await prisma.employee.findMany({
    where: { isVisible: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

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
        <CompanyHero />
        <OurStory />
        <TheProblem />
        <FoundingIdea />
        <OurJourney />
        <MissionVision />
        <Team members={members} />
      </main>
      <Footer />
    </>
  );
}
