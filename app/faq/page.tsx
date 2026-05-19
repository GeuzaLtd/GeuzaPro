import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import FAQAccordions from './_components/FAQAccordions';

export const metadata: Metadata = {
  title: 'FAQ – Assistive Devices, Ordering & Partnerships | Geuza',
  description: 'Frequently asked questions about Geuza assistive devices — wheelchairs, crutches, prosthetics — ordering in Rwanda and across Africa, donations, and partnership opportunities.',
};

const FAQ_SCHEMA_ITEMS = [
  { q: 'What is Geuza?', a: 'Geuza is a Rwandan social enterprise that designs and manufactures affordable assistive devices from recycled electronic waste. The name "Geuza" is a Swahili word meaning "to transform" — reflecting our mission to transform discarded materials into life-changing tools for people with disabilities.' },
  { q: 'Where is Geuza based?', a: 'Geuza is headquartered in Kigali, Rwanda, and operates across Africa. We work with communities, NGOs, governments, and healthcare providers throughout the continent to deliver assistive technology where it is needed most.' },
  { q: "What is Geuza's mission?", a: 'Our mission is to make assistive technology accessible and affordable for every person who needs it across Africa, using sustainable production methods that give new life to recycled e-waste.' },
  { q: 'What types of assistive devices does Geuza make?', a: 'We manufacture a wide range of assistive devices including wheelchairs, crutches, prosthetic limbs, hearing aids, walking aids, vision aids, knee braces, back support devices, and grabber tools — all designed to support independence and mobility for people with various disabilities.' },
  { q: 'Are the devices made from recycled materials safe?', a: 'Absolutely. Every device goes through rigorous quality checks and safety testing before it reaches a user. Recycled components are carefully selected, cleaned, and processed to meet safety standards.' },
  { q: 'Can devices be customised for individual needs?', a: 'Yes. Many of our devices can be adapted to suit specific measurements, conditions, or preferences. When placing an order, you can include details about any special requirements, and our team will follow up with you.' },
  { q: 'How do I place an order?', a: 'Browse our product catalogue on the Shop page, select the device you need, and submit an order request. Our team reviews every order and contacts you to confirm details, answer questions, and arrange delivery or collection.' },
  { q: 'What payment methods do you accept?', a: 'We accept mobile money (MTN Mobile Money and Airtel Money), bank transfers, and cash on delivery within Kigali. For institutional orders, we can issue invoices and accept purchase orders. Contact us at info@geuza.africa for institutional pricing.' },
  { q: 'How long does delivery take?', a: 'Within Kigali, delivery typically takes 2 to 5 business days. For orders to other provinces in Rwanda, allow 5 to 10 business days. International orders to other African countries are handled on a case-by-case basis.' },
  { q: 'Do you ship outside Rwanda?', a: 'We currently fulfil bulk and institutional orders outside Rwanda through NGO and government partnerships. If you are an organisation looking to procure devices for distribution in another country, please reach out via our contact form.' },
  { q: 'How does donating work?', a: 'Submitting a donation on our Donate page registers your intent to give. Our team will contact you to walk you through the next steps, confirm the amount, and arrange the transfer.' },
  { q: 'Can I specify which device my donation supports?', a: 'Yes. During the follow-up conversation with our team you can indicate a preference — for example, directing your gift toward hearing aids or prosthetics for a specific region.' },
  { q: 'What warranty do devices come with?', a: 'All Geuza devices come with a 12-month warranty covering manufacturing defects. Wear-and-tear components such as wheels and straps are covered for 6 months.' },
  { q: 'How do I contact Geuza for support?', a: 'You can reach us through the Contact section on our website, by email at info@geuza.africa, or by phone at +250-796-084-144. Our support team is available Monday to Friday, 8 am to 5 pm (CAT).' },
  { q: 'Can organisations partner with Geuza?', a: 'Yes — we actively partner with NGOs, government health agencies, hospitals, schools, and corporate sponsors. Partnerships can take the form of bulk procurement, co-funded distribution programmes, employee volunteering, or financial sponsorship.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_SCHEMA_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-black text-white/5 text-[28vw] leading-none tracking-tighter uppercase">FAQ</span>
          </span>
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
            <span className="inline-block bg-secondary/20 text-secondary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">Help Center</span>
            <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-4">Frequently Asked Questions</h1>
            <p className="text-white/50 text-base leading-relaxed">
              Everything you need to know about Geuza, our devices, ordering, and how to get involved.
            </p>
          </div>
        </section>

        {/* FAQ accordion — client component */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <FAQAccordions />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
