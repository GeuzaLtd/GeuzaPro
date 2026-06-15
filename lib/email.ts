// Email via Resend REST API — no npm package needed.
// Set RESEND_API_KEY, EMAIL_FROM, ADMIN_EMAIL, CONTACT_PHONE in .env

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BASE_FROM      = process.env.EMAIL_FROM_ADDRESS || 'no-reply@geuza.africa';

const FROM_ORDERS    = `Geuza Orders <${BASE_FROM}>`;
const FROM_DONATIONS = `Geuza Donations <${BASE_FROM}>`;
const FROM_MESSAGES  = `Geuza Messages <${BASE_FROM}>`;

export const ADMIN_EMAIL   = process.env.ADMIN_EMAIL    ?? 'admin@geuza.com';
export const CONTACT_PHONE = process.env.CONTACT_PHONE  ?? '+250-796-084-144';

async function sendEmail(to: string, subject: string, html: string, from = FROM_ORDERS): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log('\n── Email (not sent — no RESEND_API_KEY) ──');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('──────────────────────────────────────────\n');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    console.error('Email send failed:', await res.text());
  }
}

// ── Email to customer ─────────────────────────────────────────────────────────

export async function sendOrderConfirmationToCustomer(opts: {
  name:        string;
  email:       string;
  orderNumber: string;
  items:       { name: string; quantity: number; size?: string; color?: string }[];
}): Promise<void> {
  const itemRows = opts.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${i.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:center;">${i.size ?? '—'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:center;">${i.color ?? '—'}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#374151;">
      <div style="background:#0F9E59;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:rgba(255,255,255,0.6);margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Geuza Orders</p>
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Order Received!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">We've got your request and will be in touch shortly.</p>
      </div>

      <div style="background:#fff;padding:32px 24px;border:1px solid #e5e7eb;border-top:none;">
        <p style="font-size:16px;margin:0 0 8px;">Hi <strong>${opts.name}</strong>,</p>
        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.6;">
          Thank you for your order! We have successfully received it and our team will contact you soon
          to confirm availability and arrange delivery.
        </p>

        <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Order Number</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#111827;">${opts.orderNumber}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Product</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Qty</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Size</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Colour</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#15803d;">Need help? Contact us</p>
          <p style="margin:0;font-size:15px;font-weight:800;color:#0F9E59;">${CONTACT_PHONE}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Quote your order number when calling.</p>
        </div>

        <p style="font-size:13px;color:#9ca3af;margin:0;">
          This email was sent to <strong>${opts.email}</strong> because an order was placed using this address.<br/>
          © ${new Date().getFullYear()} Geuza. All rights reserved.
        </p>
      </div>
    </div>
  `;

  await sendEmail(opts.email, `Order Confirmed — ${opts.orderNumber} | Geuza`, html, FROM_ORDERS);
}

// ── Email to admin ────────────────────────────────────────────────────────────

export async function sendOrderNotificationToAdmin(opts: {
  orderNumber: string;
  name:        string;
  email:       string;
  phone:       string;
  address?:    string;
  notes?:      string;
  items:       { name: string; quantity: number; size?: string; color?: string }[];
}): Promise<void> {
  const itemRows = opts.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${i.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:center;">${i.size ?? '—'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:center;">${i.color ?? '—'}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#374151;">
      <div style="background:#111827;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:rgba(255,255,255,0.4);margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Geuza Orders</p>
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">New Order Filed</h1>
        <p style="color:#9ca3af;margin:6px 0 0;font-size:13px;">${opts.orderNumber}</p>
      </div>

      <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;">
        <h2 style="font-size:14px;font-weight:700;color:#374151;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em;">Customer Details</h2>
        <table style="width:100%;font-size:14px;margin-bottom:24px;">
          <tr><td style="color:#9ca3af;padding:4px 0;width:100px;">Name</td><td style="font-weight:600;">${opts.name}</td></tr>
          <tr><td style="color:#9ca3af;padding:4px 0;">Email</td><td><a href="mailto:${opts.email}" style="color:#0F9E59;">${opts.email}</a></td></tr>
          <tr><td style="color:#9ca3af;padding:4px 0;">Phone</td><td><a href="tel:${opts.phone}" style="color:#0F9E59;">${opts.phone}</a></td></tr>
          ${opts.address ? `<tr><td style="color:#9ca3af;padding:4px 0;">Address</td><td>${opts.address}</td></tr>` : ''}
          ${opts.notes   ? `<tr><td style="color:#9ca3af;padding:4px 0;">Notes</td><td>${opts.notes}</td></tr>`   : ''}
        </table>

        <h2 style="font-size:14px;font-weight:700;color:#374151;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em;">Items Ordered</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;">Product</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">Qty</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">Size</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">Colour</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <p style="font-size:13px;color:#9ca3af;margin:0;">
          Placed on ${new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
        </p>
      </div>
    </div>
  `;

  await sendEmail(ADMIN_EMAIL, `[New Order] ${opts.orderNumber} from ${opts.name}`, html, FROM_ORDERS);
}

// ── Donation emails ───────────────────────────────────────────────────────────

function formatDonationAmount(amount: number, currency: string): string {
  const n = amount.toLocaleString();
  if (currency === 'USD') return `$${n}`;
  if (currency === 'EUR') return `€${n}`;
  return `${n} RWF`;
}

export async function sendDonationThankYouToDonor(opts: {
  name:     string;
  email:    string;
  amount:   number;
  currency: string;
}): Promise<void> {
  const formatted = formatDonationAmount(opts.amount, opts.currency);

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#374151;">
      <div style="background:#0F9E59;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:rgba(255,255,255,0.6);margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Geuza Donations</p>
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Thank You for Your Support!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Your generosity makes a real difference.</p>
      </div>

      <div style="background:#fff;padding:32px 24px;border:1px solid #e5e7eb;border-top:none;">
        <p style="font-size:16px;margin:0 0 8px;">Hi <strong>${opts.name}</strong>,</p>
        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.6;">
          We have received your donation interest of
          <strong style="color:#0F9E59;">${formatted}</strong> and we are truly grateful for your support.
        </p>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#15803d;">What happens next?</p>
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
            The Geuza team will reach out to you at
            <strong>${opts.email}</strong> to walk you through the next steps and confirm your contribution.
          </p>
        </div>

        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.6;">
          Your gift helps Geuza design and build life-changing assistive devices including wheelchairs, prosthetics,
          crutches, hearing aids, walking aids, and more, all crafted from recycled e-waste and delivered to people
          with disabilities across Africa.
        </p>

        <p style="font-size:14px;color:#374151;font-weight:600;margin:0;">Together, we are transforming lives.</p>
        <p style="font-size:14px;color:#0F9E59;font-weight:700;margin:6px 0 0;">The Geuza Team</p>

        <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;" />
        <p style="font-size:12px;color:#9ca3af;margin:0;">
          This email was sent to <strong>${opts.email}</strong> because a donation was initiated using this address.<br/>
          &copy; ${new Date().getFullYear()} Geuza. All rights reserved.
        </p>
      </div>
    </div>
  `;

  await sendEmail(opts.email, 'Thank you for supporting Geuza', html, FROM_DONATIONS);
}

export async function sendDonationNotificationToAdmin(opts: {
  donationId: number;
  name:       string;
  email:      string;
  phone?:     string;
  amount:     number;
  currency:   string;
  message?:   string;
}): Promise<void> {
  const formatted = formatDonationAmount(opts.amount, opts.currency);

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#374151;">
      <div style="background:#111827;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:rgba(255,255,255,0.4);margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Geuza Donations</p>
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">New Donation Interest</h1>
        <p style="color:#9ca3af;margin:6px 0 0;font-size:13px;">Donation #${opts.donationId}</p>
      </div>

      <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:20px;text-align:center;">
          <p style="margin:0;font-size:28px;font-weight:800;color:#0F9E59;">${formatted}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">${opts.currency}</p>
        </div>

        <h2 style="font-size:14px;font-weight:700;color:#374151;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em;">Donor Details</h2>
        <table style="width:100%;font-size:14px;margin-bottom:24px;">
          <tr><td style="color:#9ca3af;padding:4px 0;width:80px;">Name</td><td style="font-weight:600;">${opts.name}</td></tr>
          <tr><td style="color:#9ca3af;padding:4px 0;">Email</td><td><a href="mailto:${opts.email}" style="color:#0F9E59;">${opts.email}</a></td></tr>
          <tr><td style="color:#9ca3af;padding:4px 0;">Phone</td><td>${opts.phone ? `<a href="tel:${opts.phone}" style="color:#0F9E59;">${opts.phone}</a>` : '<span style="color:#d1d5db;">Not provided</span>'}</td></tr>
          ${opts.message ? `<tr><td style="color:#9ca3af;padding:4px 0;vertical-align:top;">Message</td><td style="font-style:italic;">"${opts.message}"</td></tr>` : ''}
        </table>

        <p style="font-size:12px;color:#9ca3af;margin:0;">
          Received on ${new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
        </p>
      </div>
    </div>
  `;

  await sendEmail(ADMIN_EMAIL, `[New Donation] ${formatted} from ${opts.name}`, html, FROM_DONATIONS);
}

// ── Waitlist back-in-stock notification ───────────────────────────────────────

export async function sendWaitlistNotification(opts: {
  name:        string | null;
  email:       string;
  productName: string;
  productUrl:  string;
}): Promise<void> {
  const greeting = opts.name ? `Hi ${opts.name.split(' ')[0]},` : 'Hi there,';

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#374151;">
      <div style="background:#0F9E59;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:rgba(255,255,255,0.6);margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Geuza</p>
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">It's back in stock!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Good news — you were first to know.</p>
      </div>

      <div style="background:#fff;padding:32px 24px;border:1px solid #e5e7eb;border-top:none;">
        <p style="font-size:16px;margin:0 0 8px;">${greeting}</p>
        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.6;">
          You asked us to let you know when
          <strong style="color:#111827;">${opts.productName}</strong>
          became available again. Well — it's back!
        </p>

        <div style="text-align:center;margin-bottom:28px;">
          <a href="${opts.productUrl}"
            style="display:inline-block;background:#FF7900;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:999px;text-decoration:none;">
            View Product →
          </a>
        </div>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#15803d;">
            Stocks can move fast — grab yours before it sells out again.
          </p>
        </div>

        <p style="font-size:13px;color:#9ca3af;margin:0;">
          You received this because you signed up for restock alerts on this product at
          <a href="https://geuza.africa" style="color:#0F9E59;">geuza.africa</a>.<br/>
          &copy; ${new Date().getFullYear()} Geuza. All rights reserved.
        </p>
      </div>
    </div>
  `;

  await sendEmail(
    opts.email,
    `${opts.productName} is back in stock — Geuza`,
    html,
    FROM_ORDERS,
  );
}

// ── Contact message email ─────────────────────────────────────────────────────

export async function sendContactMessageToAdmin(opts: {
  fullName:          string;
  email:             string;
  phone?:            string;
  organizationType?: string;
  message:           string;
}): Promise<void> {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#374151;">
      <div style="background:#111827;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:rgba(255,255,255,0.4);margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Geuza Messages</p>
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">New Contact Message</h1>
      </div>

      <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;">
        <h2 style="font-size:14px;font-weight:700;color:#374151;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em;">Sender Details</h2>
        <table style="width:100%;font-size:14px;margin-bottom:24px;">
          <tr><td style="color:#9ca3af;padding:4px 0;width:120px;">Name</td><td style="font-weight:600;">${opts.fullName}</td></tr>
          <tr><td style="color:#9ca3af;padding:4px 0;">Email</td><td><a href="mailto:${opts.email}" style="color:#0F9E59;">${opts.email}</a></td></tr>
          <tr><td style="color:#9ca3af;padding:4px 0;">Phone</td><td>${opts.phone ? `<a href="tel:${opts.phone}" style="color:#0F9E59;">${opts.phone}</a>` : '<span style="color:#d1d5db;">Not provided</span>'}</td></tr>
          ${opts.organizationType ? `<tr><td style="color:#9ca3af;padding:4px 0;">Organization</td><td style="text-transform:capitalize;">${opts.organizationType}</td></tr>` : ''}
        </table>

        <h2 style="font-size:14px;font-weight:700;color:#374151;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em;">Message</h2>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:24px;">
          <p style="font-size:14px;color:#374151;line-height:1.7;margin:0;white-space:pre-wrap;">${opts.message}</p>
        </div>

        <p style="font-size:12px;color:#9ca3af;margin:0;">
          Received on ${new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
        </p>
      </div>
    </div>
  `;

  await sendEmail(ADMIN_EMAIL, `[New Message] from ${opts.fullName}`, html, FROM_MESSAGES);
}
