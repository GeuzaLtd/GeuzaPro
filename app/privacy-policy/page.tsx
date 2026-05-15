import type { Metadata } from 'next';
import { Header, Footer } from '@/components';

export const metadata: Metadata = {
  title: 'Privacy Policy | Geuza',
  description: 'Learn how Geuza collects, uses, and protects your personal information.',
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-black text-white/5 text-[14vw] leading-none tracking-tighter uppercase whitespace-nowrap">Privacy</span>
          </span>
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
            <span className="inline-block bg-secondary/20 text-secondary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">Legal</span>
            <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-4">Privacy Policy</h1>
            <p className="text-white/50 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">

            <p className="text-gray-500 text-sm leading-relaxed mb-10 p-5 bg-gray-50 rounded-xl border border-gray-100">
              Geuza Ltd ("Geuza", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website at geuza.africa or interact with our services. Please read it carefully.
            </p>

            <Section title="1. Information We Collect">
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li><strong className="text-gray-700">Account information</strong> — name, email address, password, and phone number when you register.</li>
                <li><strong className="text-gray-700">Order information</strong> — your name, contact details, delivery address, and the devices you order.</li>
                <li><strong className="text-gray-700">Donation information</strong> — your name, email, phone number, preferred currency, and donation amount.</li>
                <li><strong className="text-gray-700">Messages</strong> — the content of enquiries you send through our contact form.</li>
              </ul>
              <p className="mt-3">We also collect limited technical data automatically, such as your browser type, IP address, and pages visited, for security and analytics purposes.</p>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>Process and fulfil your orders and send you order confirmations.</li>
                <li>Follow up on donation interest and coordinate payment.</li>
                <li>Respond to your enquiries and provide customer support.</li>
                <li>Send transactional emails (order updates, donation acknowledgements).</li>
                <li>Improve our website, products, and services.</li>
                <li>Comply with legal obligations applicable under Rwandan law.</li>
              </ul>
              <p className="mt-3">We do not use your information for automated decision-making or profiling.</p>
            </Section>

            <Section title="3. Sharing Your Information">
              <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li><strong className="text-gray-700">Service providers</strong> — such as email delivery services (Resend) and image hosting (Cloudinary) that help us operate our platform. These providers are contractually bound to keep your data secure.</li>
                <li><strong className="text-gray-700">Google</strong> — if you sign in using Google OAuth, we receive your name and email address from Google in accordance with their privacy policy.</li>
                <li><strong className="text-gray-700">Legal authorities</strong> — if required by law or to protect the rights and safety of Geuza or others.</li>
              </ul>
            </Section>

            <Section title="4. Cookies">
              <p>We use session cookies to keep you signed in and to maintain your cart between visits. These cookies are strictly necessary for the website to function and are deleted when you sign out or close your browser.</p>
              <p>We do not use advertising cookies or tracking pixels from social media platforms on our website.</p>
            </Section>

            <Section title="5. Data Security">
              <p>We take reasonable technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse. Passwords are hashed using bcrypt and never stored in plain text. All data is transmitted over HTTPS.</p>
              <p>No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
            </Section>

            <Section title="6. Data Retention">
              <p>We retain your personal information for as long as your account is active or as needed to provide you with services. If you request account deletion, we will remove your personal data within 30 days, except where we are required to retain it for legal or financial compliance purposes.</p>
            </Section>

            <Section title="7. Your Rights">
              <p>Under applicable data protection law, you have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>Access the personal information we hold about you.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request deletion of your account and associated data.</li>
                <li>Withdraw consent where processing is based on consent.</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:info@geuza.africa" className="text-primary underline">info@geuza.africa</a>.</p>
            </Section>

            <Section title="8. Third-Party Links">
              <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies before providing any personal information.</p>
            </Section>

            <Section title="9. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of our website after changes are posted constitutes your acceptance of the updated policy.</p>
            </Section>

            <Section title="10. Contact Us">
              <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>
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
