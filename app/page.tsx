import {
  Header,
  Hero,
  About,
  Products,
  Blog,
  Impact,
  Testimonials,
  Team,
  Contact,
  Footer,
} from '@/components';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Products />
        <Blog />
        <Impact />
        <Testimonials />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
