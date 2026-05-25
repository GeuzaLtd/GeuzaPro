import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import DonateHero from './_components/DonateHero';
import ImpactNumbers from './_components/ImpactNumbers';
import FundraisingGoal from './_components/FundraisingGoal';
import DonateSection from './_components/DonateSection';
import WhyDonate from './_components/WhyDonate';

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support Geuza by donating to fund affordable assistive devices including wheelchairs, prosthetics, hearing aids, and walking aids, made from recycled e-waste for people with disabilities across Africa.',
};

export default function DonatePage() {
  return (
    <>
      <Header />
      <main>
        <DonateHero />
        <ImpactNumbers />
        <FundraisingGoal />
        <DonateSection />
        <WhyDonate />
      </main>
      <Footer />
    </>
  );
}
