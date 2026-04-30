'use client';

import { useState } from 'react';

const FAQS = [
  {
    section: 'About Geuza',
    items: [
      {
        q: 'What is Geuza?',
        a: 'Geuza is a Rwandan social enterprise that designs and manufactures affordable assistive devices from recycled electronic waste. The name "Geuza" is a Swahili word meaning "to transform" — reflecting our mission to transform discarded materials into life-changing tools for people with disabilities.',
      },
      {
        q: 'Where is Geuza based?',
        a: 'Geuza is headquartered in Kigali, Rwanda, and operates across Africa. We work with communities, NGOs, governments, and healthcare providers throughout the continent to deliver assistive technology where it is needed most.',
      },
      {
        q: "What is Geuza's mission?",
        a: 'Our mission is to make assistive technology accessible and affordable for every person who needs it across Africa, using sustainable production methods that give new life to recycled e-waste.',
      },
    ],
  },
  {
    section: 'Products and Devices',
    items: [
      {
        q: 'What types of assistive devices does Geuza make?',
        a: 'We manufacture a wide range of assistive devices including wheelchairs, crutches, prosthetic limbs, hearing aids, walking aids, vision aids, knee braces, back support devices, and grabber tools — all designed to support independence and mobility for people with various disabilities.',
      },
      {
        q: 'Are the devices made from recycled materials safe?',
        a: 'Absolutely. Every device goes through rigorous quality checks and safety testing before it reaches a user. Recycled components are carefully selected, cleaned, and processed to meet safety standards. We never compromise on quality or safety in favour of cost savings.',
      },
      {
        q: 'Can devices be customised for individual needs?',
        a: 'Yes. Many of our devices can be adapted to suit specific measurements, conditions, or preferences. When placing an order, you can include details about any special requirements, and our team will follow up with you to ensure the right fit.',
      },
    ],
  },
  {
    section: 'Ordering',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our product catalogue on the Shop page, select the device you need, and submit an order request. Our team reviews every order and contacts you to confirm details, answer questions, and arrange delivery or collection.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept mobile money (MTN Mobile Money and Airtel Money), bank transfers, and cash on delivery within Kigali. For institutional orders, we can issue invoices and accept purchase orders. Contact us at info@geuza.rw for institutional pricing.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Within Kigali, delivery typically takes 2 to 5 business days. For orders to other provinces in Rwanda, allow 5 to 10 business days. International orders to other African countries are handled on a case-by-case basis — contact us for a quote.',
      },
      {
        q: 'Do you ship outside Rwanda?',
        a: 'We currently fulfil bulk and institutional orders outside Rwanda through NGO and government partnerships. If you are an organisation looking to procure devices for distribution in another country, please reach out via our contact form and we will work out the logistics together.',
      },
    ],
  },
  {
    section: 'Donations',
    items: [
      {
        q: 'How does donating work?',
        a: 'Submitting a donation on our Donate page registers your intent to give. Our team will contact you at the email you provide to walk you through the next steps, confirm the amount, and arrange the transfer. We do not process card payments online at this time.',
      },
      {
        q: 'Can I specify which device my donation supports?',
        a: 'Yes. During the follow-up conversation with our team you can indicate a preference — for example, directing your gift toward hearing aids or prosthetics for a specific region. We do our best to honour donor preferences while directing resources where the need is greatest.',
      },
      {
        q: 'Will I receive confirmation of my donation?',
        a: 'Yes. You will receive an email acknowledgement as soon as your donation is submitted, and a second confirmation once the funds have been received. We also send periodic impact updates so you can see how your contribution is being used.',
      },
    ],
  },
  {
    section: 'Support and Partnerships',
    items: [
      {
        q: 'What warranty do devices come with?',
        a: 'All Geuza devices come with a 12-month warranty covering manufacturing defects. If a device fails under normal use within the warranty period, we will repair or replace it at no cost. Wear-and-tear components such as wheels and straps are covered for 6 months.',
      },
      {
        q: 'How do I contact Geuza for support?',
        a: 'You can reach us through the Contact section on our website, by email at info@geuza.rw, or by phone at +250 790 000 000. Our support team is available Monday to Friday, 8 am to 5 pm (CAT).',
      },
      {
        q: 'Can organisations partner with Geuza?',
        a: 'Yes — we actively partner with NGOs, government health agencies, hospitals, schools, and corporate sponsors. Partnerships can take the form of bulk procurement, co-funded distribution programmes, employee volunteering, or financial sponsorship. Fill in our contact form and select "Organisation" to start the conversation.',
      },
    ],
  },
];

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-gray-900 text-base leading-snug">{q}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${open ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {open ? <path d="M5 12h14" /> : <><path d="M12 5v14" /><path d="M5 12h14" /></>}
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-gray-500 text-sm leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

export default function FAQAccordions() {
  return (
    <>
      {FAQS.map((group) => (
        <div key={group.section} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-6 rounded-full bg-primary block" />
            <h2 className="font-bold text-gray-900 text-lg tracking-wide">{group.section}</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
            {group.items.map((item) => (
              <Accordion key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 bg-primary/5 border border-primary/15 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-gray-900 text-lg mb-2">Still have questions?</h3>
        <p className="text-gray-500 text-sm mb-6">Our team is happy to help. Reach out through any of the channels below.</p>
        <a
          href="/#contact"
          className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-7 py-3 rounded-full hover:bg-[#0d8a4d] transition-colors"
        >
          Contact Us
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </>
  );
}
