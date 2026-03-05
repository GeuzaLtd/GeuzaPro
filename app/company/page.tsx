import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import CompanyHero   from './_components/CompanyHero';
import MissionVision from './_components/MissionVision';
import OurHistory    from './_components/OurHistory';
import CompanyTeam   from './_components/CompanyTeam';

export const metadata: Metadata = {
  title: 'Company | Geuza',
  description:
    'Learn about Geuza — our mission to transform e-waste into affordable assistive devices, our vision for an inclusive Africa, and the team making it happen.',
};

export default function CompanyPage() {
  return (
    <>
      <Header />
      <main>
        <CompanyHero />
        <MissionVision />
        <OurHistory />
        <CompanyTeam />
      </main>
      <Footer />
    </>
  );
}
