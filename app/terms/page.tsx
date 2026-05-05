import type { Metadata } from 'next';
import { Header, Footer } from '@/components';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Geuza',
  description: 'Read the terms and conditions governing your use of the Geuza website and services.',
};

const LAST_UPDATED = 'April 30, 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1 h-5 rounded-full bg-primary block flex-shrink-0" />
        <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
      </div>
      <div className="text-gray-500 text-sm leading-relaxed space-y-3 pl-4">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-black text-white/5 text-[10vw] leading-none tracking-tighter uppercase whitespace-nowrap">Terms and Conditions</span>
          </span>
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
            <span className="inline-block bg-secondary/20 text-secondary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">Legal</span>
            <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-4">Terms and Conditions</h1>
            <p className="text-white/50 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">

            <p className="text-gray-500 text-sm leading-relaxed mb-10 p-5 bg-gray-50 rounded-xl border border-gray-100">
              Please read these Terms and Conditions carefully before using the Geuza website (geuza.africa) or placing an order. By accessing our website or submitting an order, you agree to be bound by these terms. If you do not agree, please do not use our services.
            </p>

            <Section title="1. Who We Are">
              <p>These Terms and Conditions govern your use of the website and services operated by <strong className="text-gray-700">Geuza Ltd</strong>, a company incorporated in Rwanda and headquartered in Kigali. References to "Geuza", "we", "our", or "us" throughout this document refer to Geuza Ltd.</p>
            </Section>

            <Section title="2. Use of the Website">
              <p>You may use our website for lawful purposes only. You agree not to:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>Use the website in any way that violates applicable Rwandan or international law.</li>
                <li>Attempt to gain unauthorised access to any part of our systems or data.</li>
                <li>Transmit any harmful, fraudulent, or misleading content through our platform.</li>
                <li>Reproduce, distribute, or resell any content from this website without written permission from Geuza.</li>
              </ul>
              <p className="mt-3">We reserve the right to suspend or terminate access to the website for any user who violates these terms.</p>
            </Section>

            <Section title="3. Accounts">
              <p>When you create an account on our website, you are responsible for keeping your login credentials confidential. You agree to notify us immediately at <a href="mailto:info@geuza.africa" className="text-primary underline">info@geuza.africa</a> if you suspect any unauthorised use of your account.</p>
              <p>We reserve the right to disable accounts that violate these terms or that have been inactive for an extended period.</p>
            </Section>

            <Section title="4. Orders and Fulfilment">
              <p>Submitting an order through our website constitutes a request to purchase or receive a device. An order is not confirmed until you receive a confirmation email or a follow-up call from our team.</p>
              <p>We reserve the right to decline or cancel any order for reasons including but not limited to:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>Product unavailability or stock shortages.</li>
                <li>Inaccurate or incomplete order information.</li>
                <li>Suspected fraudulent activity.</li>
              </ul>
              <p className="mt-3">Prices displayed on the website are indicative and may be confirmed or adjusted by our team based on your specific requirements, delivery location, and currency at the time of order.</p>
            </Section>

            <Section title="5. Payments">
              <p>Payment is arranged through our team after order confirmation. Accepted methods currently include mobile money (MTN Mobile Money, Airtel Money), bank transfer, and cash on delivery within Kigali. We do not process card payments online at this time.</p>
              <p>For institutional orders, we can issue formal invoices and purchase orders. Contact us at <a href="mailto:info@geuza.africa" className="text-primary underline">info@geuza.africa</a> for institutional arrangements.</p>
            </Section>

            <Section title="6. Donations">
              <p>Submitting a donation through our website registers your intent to give. It does not constitute a legally binding financial commitment until funds are received by Geuza. Our team will contact you to coordinate payment.</p>
              <p>Geuza will use donated funds to advance its mission of providing assistive devices to people with disabilities across Africa. While we endeavour to honour donor preferences regarding device type or region, we retain discretion to allocate funds where the need is greatest.</p>
            </Section>

            <Section title="7. Warranty and Returns">
              <p>All devices come with a 12-month warranty against manufacturing defects from the date of delivery. Consumable or wear-and-tear components carry a 6-month warranty.</p>
              <p>To make a warranty claim, contact us at <a href="mailto:info@geuza.africa" className="text-primary underline">info@geuza.africa</a> with your order details and a description of the issue. Defective devices will be repaired or replaced at our discretion and at no cost to you.</p>
              <p>Devices that have been modified, misused, or damaged through user error are not covered by warranty.</p>
            </Section>

            <Section title="8. Intellectual Property">
              <p>All content on this website — including text, images, logos, device designs, and software — is the property of Geuza Ltd or its licensors and is protected by applicable intellectual property law.</p>
              <p>You may not reproduce, copy, distribute, or create derivative works from any content on this website without our prior written consent.</p>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>To the maximum extent permitted by law, Geuza shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or services.</p>
              <p>Our total liability to you for any claim arising out of or in connection with these terms shall not exceed the amount you paid us for the relevant order.</p>
              <p>Nothing in these terms limits our liability for death, personal injury caused by our negligence, or fraud.</p>
            </Section>

            <Section title="10. Governing Law">
              <p>These Terms and Conditions are governed by the laws of the Republic of Rwanda. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Rwanda.</p>
            </Section>

            <Section title="11. Changes to These Terms">
              <p>We may update these Terms and Conditions at any time. Changes will be posted on this page with a revised "Last updated" date. Continued use of our website after changes are published constitutes acceptance of the updated terms.</p>
            </Section>

            <Section title="12. Contact Us">
              <p>If you have any questions about these Terms and Conditions, please contact us:</p>
              <div className="mt-3 space-y-1">
                <p><strong className="text-gray-700">Geuza Ltd</strong></p>
                <p>Kigali, Rwanda</p>
                <p>Email: <a href="mailto:info@geuza.africa" className="text-primary underline">info@geuza.africa</a></p>
                <p>Phone: +250-796-084-144</p>
              </div>
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
