/**
 * Content seed — migrates blogs, partners, and testimonials from the old schema.
 *
 * Old → New mapping:
 *
 * BLOGS:
 *   body        → content
 *   thumbnailImage → coverImage
 *   minRead     → readTime
 *   authorName  → User record upserted by name; linked via authorId
 *   (no excerpt) → first 220 chars of body used as excerpt
 *   (no slug)   → generated from title
 *   (no status) → "published" (all old blogs were live)
 *
 * PARTNERS:
 *   name + logo → name + logo (straightforward, minimal old schema)
 *
 * TESTIMONIALS:
 *   companyName  → name (person/org name) + company (same value)
 *   testimonial  → quote
 *   companyImage → avatar (company logo used as avatar)
 *   (no rating)  → 5 (default)
 *
 * Run: npm run seed:content
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env'), override: true });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import pkg from 'pg';
const { Pool } = pkg;

let pool: InstanceType<typeof Pool>;
let prisma: PrismaClient;

// ─── Raw data from old DB ─────────────────────────────────────────────────────

const OLD_BLOGS = [{"id":"0dbf1367-bd82-45e6-a2ae-fd4d98270af4","title":"Geuza Joins the CMU Africa Entrepreneurship Program – Official Launch","body":"Geuza is proud to be among the selected startups participating in the Carnegie Mellon University Africa Entrepreneurship Program, an initiative designed to support innovative businesses in scaling their impact.\r\nThis photo captures the launch of the program's activities, bringing together talented entrepreneurs from various sectors who will benefit from expert mentorship, skill-building workshops, and access to valuable networks over the coming months.\r\nBeing part of this program marks an exciting chapter for Geuza, as it provides the opportunity to strengthen our strategies, enhance our solutions, and connect with fellow changemakers working to solve Africa's most pressing challenges.\r\nAt Geuza, we see this as more than just an opportunity for growth — it's a platform to share our mission, learn from others, and collaborate towards a future where inclusion is at the heart of innovation.","authorName":"Geuza Admin","minRead":6,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755207882/blogs/py00xvm4mh5sul01nojv.jpg","createdAt":"2025-08-14 21:44:42.554","updatedAt":"2025-08-14 21:44:42.554"},{"id":"1462b2d9-d654-44bc-9ef2-9d8c251eed8e","title":"Showcasing Geuza at the African Startup Conference – Algeria 2024","body":"In December 2024, Geuza had the privilege of participating in the African Startup Conference held in Algeria — a gathering that celebrates innovation, entrepreneurship, and Africa's growing startup ecosystem.\r\nOne of the highlights was presenting Geuza's mission and solutions to Noureddine Ouadah, Algeria's Minister of Knowledge Economy, Startups, and Micro Enterprises. It was an incredible opportunity to share how Geuza is driving change through assistive solutions that break barriers for people with disabilities.\r\nThe event was a powerful platform to connect with visionary leaders, exchange ideas with fellow innovators, and showcase the transformative potential of inclusive design in building a better future for all.\r\nAt Geuza, we believe in a future where people with disabilities have equal opportunities — and we work every day to create it, while inspiring others to do the same.","authorName":"Geuza Admin","minRead":7,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755209180/blogs/fpldumharozwqeubqr6h.png","createdAt":"2025-08-14 21:41:49.6","updatedAt":"2025-08-15 08:20:42.334"},{"id":"260ede80-52d2-4c8e-ae59-12472bc50667","title":"GEUZA Founders Pitching for Funds to Support Sustainable Innovation and Growth","body":"In November 2023, Geuza secured crucial grant funding from Allan & Gill Gray Philanthropy Rwanda through the Jasiri Talent Investor Program, marking a pivotal moment in our journey.\r\nThis support provided the resources needed to officially launch our operations and begin developing eco-friendly assistive devices crafted from recycled e-waste. With this backing, we accelerated our mission to create durable, sustainable mobility aids that empower individuals with mobility challenges while reducing environmental waste.\r\nThe grant was more than just financial support — it was a vote of confidence in our vision to combine innovation, sustainability, and social impact. It laid the foundation for the work we continue to do today, turning recycled materials into life-changing solutions.\r\nAt Geuza, we are grateful for partners who believe in our mission and help us bring it to life.\r\n📸 A milestone moment as Geuza embarks on its mission with the support of the Jasiri Talent Investor Program.","authorName":"Geuza Admin","minRead":2,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754854214/blogs/ta0jyb7otoklmdcgkxo4.jpg","createdAt":"2025-08-10 19:30:14.849","updatedAt":"2025-08-15 08:18:00.917"},{"id":"26d518b5-98a4-4b21-91e5-b7d3858609ae","title":"Geuza Supports Women's Mobility Through Community Outreach in Nyabihu","body":"Geuza participated in a community outreach initiative in Nyabihu alongside UNABU and Rihima Hospital on November 20 ,2025. We had an opportunity to  engage with women experiencing mobility challenges and learned directly from their lived experiences. The outreach created a meaningful space for consultations, assessments, and conversations focused on improving mobility and everyday independence.\r\nThe engagement offered valuable insights into the real needs of users, reinforcing the importance of designing assistive devices that are durable, accessible, and suitable for diverse environments. Many women expressed both curiosity and hope about innovations that can enhance their mobility, dignity, and confidence.\r\nWorking together with partners committed to gender equity and community well-being strengthened Geuza's commitment to developing human-centered, sustainable mobility solutions. The experience highlighted the impact of bringing technology closer to the communities who need it most.\r\nGeuza remains dedicated to creating assistive devices that empower individuals and contribute to a more inclusive society.","authorName":"Francis Bireremba","minRead":4,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1764073523/blogs/vej76cd7rldcs4q0rf6q.jpg","createdAt":"2025-11-25 12:25:24.006","updatedAt":"2025-11-25 12:25:24.006"},{"id":"529b2fc0-f741-44f5-a180-166a20e53bd8","title":"Geuza at Hanga Pitchfest 2025: Showcasing Smart Mobility and IoT Assistive Innovation","body":"Geuza proudly participated in Hanga Pitchfest 2025 at BK Arena, presenting our IoT-\r\nenabled smart crutches and the upcoming Geuza mobile app. Visitors were excited to see\r\nhow technology and human-centered design come together to improve mobility.\r\nThe engagement at our booth was incredibly positive, with many attendees expressing\r\ncuriosity about our mission of inclusion, affordability, and sustainability. Their feedback\r\nreaffirmed the value of accessible assistive solutions in Rwanda and beyond.\r\nThrough partners such as Carnegie Mellon University Africa and MINICT, we\r\ndemonstrated how purposeful innovation can drive real impact. Geuza remains committed\r\nto creating mobility devices that empower individuals with dignity, confidence, and\r\nindependence.","authorName":"Francis Bireremba","minRead":5,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1763456239/blogs/rmmds8nyxhnffwvttgii.jpg","createdAt":"2025-11-18 08:56:14.418","updatedAt":"2025-11-18 08:57:19.869"},{"id":"877813ad-9156-470c-be89-131669e76178","title":"GEUZA WON 2nd Place at Hanga PitchFest 2024","body":"We are thrilled to announce that Geuza has been awarded 2nd place at the prestigious Hanga PitchFest 2024 — a flagship Rwandan government initiative that celebrates and supports outstanding innovators shaping the country's future.\r\nThis incredible achievement is a testament to our unwavering commitment to innovation, sustainability, and positive social impact. The recognition underscores our mission to transform recycled materials into life-changing assistive devices, addressing both environmental waste and mobility challenges.\r\nHanga PitchFest brings together Rwanda's most promising startups, visionary entrepreneurs, and impactful ideas, offering them a platform to showcase their solutions, gain visibility, and attract partnerships. Being recognized among such inspiring innovators strengthens our resolve to continue pushing the boundaries of inclusive and sustainable design.\r\nAt Geuza, we don't just innovate for impact — we innovate to change lives.","authorName":"Geuza Admin","minRead":3,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754854339/blogs/nrxi2cbdleiksdxokk4p.jpg","createdAt":"2025-08-10 19:32:20.08","updatedAt":"2025-08-15 08:16:14.338"},{"id":"91a75901-83fc-4a2c-becb-d1d85543509b","title":"Geuza at the Timbuktoo Health Tech Startup Bootcamp – November 2024","body":"In November 2024, Geuza joined 40 other visionary entrepreneurs from across Africa for the Timbuktoo Health Tech Startup Bootcamp, a UNDP initiative dedicated to accelerating health innovation across the continent.\r\nThe bootcamp brought together passionate founders from the health tech domain to share knowledge, exchange experiences, and explore ways to scale impactful solutions. Over several days, participants engaged in practical training sessions, mentorship opportunities, and collaborative discussions that challenged and inspired them to think bigger.\r\nFor Geuza, the experience was more than just learning — it was about forging meaningful connections with like-minded entrepreneurs whose work, when combined, can create powerful synergies for health and inclusion in Africa. These relationships hold the potential for future collaborations that could scale solutions to new heights.\r\nAt Geuza, we believe that progress is built on collaboration — and we are committed to turning these connections into opportunities that change lives.","authorName":"Geuza Admin","minRead":5,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755207812/blogs/byv3celz5nwsnsddoowi.jpg","createdAt":"2025-08-14 21:43:32.75","updatedAt":"2025-08-14 21:43:32.75"},{"id":"94d51a10-8a8a-4773-9c2f-a75c6caa6f0f","title":"Geuza Unveils Its First Prototype: Eco-Friendly Crutches and Cane","body":"Geuza is proud to unveil the first version of our innovative assistive devices — crutches and canes — designed to empower individuals with mobility challenges.\r\nThese prototypes mark a major milestone in our journey to combine inclusive design with sustainability. Developed using eco-friendly materials sourced from recycled e-waste, they represent our commitment to reducing environmental impact while delivering high-quality, durable mobility aids.\r\nThe unveiling took place at our facility in the Kigali Special Economic Zone, Masoro, where the prototypes were tested and refined to ensure both functionality and comfort for end users. This is more than just a product launch — it's a step toward a future where assistive devices are accessible, sustainable, and built to last.\r\nAt Geuza, we believe innovation should serve both people and the planet — and these prototypes are a testament to that belief.\r\n📸 Captured at our Kigali Special Economic Zone facility, here's a first look at our eco-friendly assistive device prototypes.","authorName":"Geuza Admin","minRead":2,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754853871/blogs/ahq4b9lxt6soyvkhorgw.jpg","createdAt":"2025-08-10 19:24:32.388","updatedAt":"2025-08-15 08:17:26.14"},{"id":"a0abdcfa-228c-418c-ac2f-bf291a0533f5","title":"Shaping the Future of Disability Inclusion – Hacking Disability Hackathon","body":"Geuza was honored to be part of the panel at the Hacking Disability Hackathon, co-organized by Carnegie Mellon University Africa and Bridging Afrika in August 2025. This impactful event gathered innovators, entrepreneurs, and advocates to co-create solutions that promote disability inclusion across Africa and beyond.\r\nDuring the panel, Geuza shared its perspective on the role of inclusive innovation in breaking accessibility barriers, drawing from its own journey in developing assistive solutions — whether through technology, design, or practical support systems. The discussion explored strategies for creating solutions that address real needs, foster collaboration across sectors, and deliver sustainable impact for people with disabilities.\r\nGeuza also took time to encourage and motivate young entrepreneurs to channel their creativity and skills toward solutions in this meaningful area of our world — an area where thoughtful design and innovation can truly change lives.\r\nThe exchange of ideas left Geuza inspired and committed to continuing its work in designing solutions that make a real difference in people's lives.\r\nAt Geuza, we don't just imagine a world where people with disabilities face no barriers — we create it, and encourage others to do so as well.","authorName":"Geuza Admin","minRead":7,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755206797/blogs/sjlvmelho8gxokjqainz.jpg","createdAt":"2025-08-14 21:26:38.207","updatedAt":"2025-08-14 21:26:38.207"},{"id":"c7cb1b53-d190-4351-8115-c5f89dd6acda","title":"Geuza at the Inclusive Fintech Forum 2025 – Showcasing Innovation in Health Tech","body":"As part of the UNDP Timbuktoo program, Geuza proudly participated in the Inclusive Fintech Forum 2025 (IFF) — a global gathering dedicated to advancing financial inclusion through innovation.\r\nThe event brought together entrepreneurs, investors, policymakers, and industry leaders to explore solutions that can bridge financial gaps and empower communities. Within this vibrant platform, Geuza showcased its health tech innovations, highlighting how inclusive solutions can transform lives and create new opportunities for people with disabilities.\r\nBeyond showcasing, Geuza engaged in meaningful conversations with different financial aggregators, explored potential partnerships, and networked with fellow innovators from the health tech ecosystem. These interactions opened doors for future collaborations that can help scale impactful solutions to more communities.\r\nAt Geuza, we know that innovation thrives when technology, finance, and inclusion work hand in hand — and the Inclusive Fintech Forum was a powerful space to make that happen.","authorName":"Geuza Admin","minRead":5,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755207951/blogs/kkolwcz8dyszk1gqwm4l.jpg","createdAt":"2025-08-14 21:45:52.507","updatedAt":"2025-08-14 21:45:52.507"},{"id":"c947290a-70c4-4419-abf6-1403c23189fb","title":"Geuza Showcases Innovation During Global Entrepreneurship Week at CMU-Africa","body":"Geuza participated in the final day of Global Entrepreneurship Week ( Nov 17 -21 ,2025) hosted at CMU-Africa, showcasing our smart mobility solutions alongside other innovative startups. The event provided an exciting opportunity to present our IoT-enabled smart crutches and share Geuza's mission with a diverse audience of students and professionals.\r\n\r\nThroughout the exhibition, we engaged with students from ALU, Kepler University, the University of Rwanda, and CMU-Africa, as well as entrepreneurs and industry experts. Many expressed strong interest in Geuza's blend of human-centered design and purposeful technology aimed at improving mobility and independence.\r\nThe day concluded with an energizing networking session where we connected with professionals, innovators, and university students eager to learn more about Geuza and explore potential collaborations. The engagement highlighted the importance of innovation ecosystems in driving inclusive and sustainable solutions for mobility challenges.\r\nGeuza continues to stand at the intersection of technology and social impact, committed to creating mobility devices that promote dignity, confidence, and independence.","authorName":"Francis Bireremba","minRead":4,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1764072940/blogs/rfbnhgy7fdb9jbkvaije.jpg","createdAt":"2025-11-25 12:15:41.102","updatedAt":"2025-11-25 12:17:26.913"},{"id":"d88e6a77-ef3c-4fc7-8919-aa9d7d6b2824","title":"Celebrating Inclusion & Mobility on the International Day of Persons with Disabilities","body":"Geuza Celebrates the International Day of Persons with Disabilities in Gikondo\r\nEvery year on 3rd December, the world marks the International Day of Persons with Disabilities, a moment dedicated to recognizing the rights, achievements, and lived experiences of persons with disabilities. For Geuza, this day is more than a global observance—it reflects the purpose behind our work and the communities we serve.\r\n\r\nThis year, we were honored to participate in the commemoration event held at Akagari ka Gikondo in Kicukiro District, where local leaders, families, and people with disabilities gathered to engage, share, and celebrate resilience.\r\n\r\nThe event offered powerful conversations about daily realities—limited access to mobility support, challenges in employment and education, and the pursuit of independence. Listening to these stories reaffirmed our belief that mobility is a basic human right and that expanding access to assistive devices remains essential for achieving an inclusive society.\r\n\r\nAt Geuza, we remain committed to restoring dignity through mobility. Being part of this day strengthened our dedication to:\r\n\r\nEnhancing access to reliable assistive devices\r\n\r\nSupporting community-driven initiatives\r\n\r\nPartnering with leaders and organizations advocating for equal opportunities\r\n\r\nContinuing our mission of empowering individuals to live independently\r\n\r\nWe extend our sincere appreciation to the Gikondo community for the warm welcome and collaborative spirit. Together, we move closer to creating a society where everyone can thrive—regardless of ability.\r\n","authorName":"Francis BIREREMBA","minRead":2,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1764933109/blogs/py3zrtlfbvcgs8iybb8u.jpg","createdAt":"2025-12-05 11:11:49.939","updatedAt":"2025-12-05 11:11:49.939"},{"id":"e1887591-97f3-4298-ba3b-007933f15e08","title":"Transforming Waste into Innovation/GEUZA's Material Research","body":"At Westerwelle Start-up Haus Kigali, the founders of Geuza, together with skilled technicians, carried out hands-on testing of e-plastic waste to identify the most suitable raw materials for our production process.\r\nThis practical research is a vital step in ensuring that the recycled materials used in our assistive devices meet the highest standards of durability and sustainability. By rigorously evaluating different material types, we move closer to producing eco-friendly, high-quality products that deliver both performance and positive environmental impact.\r\nMaterial innovation is at the core of Geuza's mission — to transform waste into life-changing solutions, reducing environmental harm while improving mobility and accessibility for people with disabilities. Every test, every experiment, and every breakthrough takes us a step closer to making that vision a reality.\r\n📸 Here's a snapshot from our testing session at Westerwelle Start-up Haus Kigali, where ideas and materials came together to shape the future of inclusive innovation.","authorName":"Geuza Admin","minRead":3,"thumbnailImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754854282/blogs/kptadrgtuy9wzfd1wnfb.jpg","createdAt":"2025-08-10 19:31:22.731","updatedAt":"2025-08-15 08:19:30.115"}];

const OLD_PARTNERS = [{"id":"4d768134-9db1-4565-9204-12ab4fd5f5df","name":"Jasiri","logo":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754853176/partners/g19rqrhfw8i6z2l1zaia.png"},{"id":"52164fe8-5141-41fe-8b84-785265b41bf2","name":"Ministry of ICT","logo":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754897302/partners/c5orspuncxsmtkze2w3a.png"},{"id":"62df2e1d-4c71-4e16-be3b-1aa478343755","name":"Alan & Gill Gray Foundation","logo":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754853528/partners/gxeer9gulafhuc8s0aci.png"},{"id":"7225964c-8c8a-4f65-8d4a-1b3d3ac0b48e","name":"Hanga Central","logo":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754853336/partners/ontnnwbv6heywsmjpb7d.svg"},{"id":"96608ad9-7410-4e2e-a1d6-868cc6455cd6","name":"Timbktoo","logo":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754897477/partners/ybt3ni1d7qkeyeyqwzfj.jpg"},{"id":"aa52b3fb-fdfc-4092-afc3-31f95dea2c32","name":"CMU-Africa","logo":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754852862/partners/mr0i3kppdkupnxizljur.jpg"},{"id":"c6728be6-46a1-4ee3-ad8b-ab2bfcf18474","name":"RSB","logo":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754897886/partners/tnigpqpmkczsjiqvs7d7.png"},{"id":"fa9c302d-dec2-41b7-8b04-ab9e9f4d4c11","name":"UNDP","logo":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754897716/partners/n0n4y84vekktkdamydnr.webp"}];

const OLD_TESTIMONIALS = [{"id":"0ca4abc6-570a-4664-a87e-491e4158cce8","companyName":"AGL, RWANDA","testimonial":"Working with GEUZA has been a game-changer for our organization. Their products are of exceptional quality, and their service is unparalleled. As a business owner, I rely on GEUZA to provide reliable and innovative solutions that meet our needs. They consistently go above and beyond to ensure customer satisfaction, and their attention to detail is second to none.","companyImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754852190/testimonials/xq0nx6iipy6qm35izlo2.svg"},{"id":"76f4748f-7d75-4a6a-82f5-09f1b3fa136a","companyName":"ENVIROSERVE","testimonial":"GEUZA's innovative approach to product development has significantly improved our operations. Their solutions are not only cutting-edge but also practical and user-friendly. We have seen a significant boost in productivity since partnering with GEUZA. Their team is knowledgeable, responsive, and always willing to help. I highly recommend GEUZA to any business looking to enhance their efficiency.","companyImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754896641/testimonials/c2f31ukiuhwthynrehd8.png"},{"id":"e39c59b3-fec1-4e6c-b3dc-ca0719b14d1a","companyName":" LAMINAR TECHNOLOGIES","testimonial":"GEUZA has been an incredibly positive influence on our business. They deliver high-quality products that meet our exact specifications and requirements. Their team is professional, attentive, and always ready to provide support and guidance. GEUZA has become an essential partner in our business growth, and we look forward to many more years of collaboration.","companyImage":"https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754851922/testimonials/xuzriqyry9krnnz3ab8e.avif"}];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 100);
}

function excerpt(body: string, maxLen = 220): string {
  const clean = body.replace(/\r\n/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.length <= maxLen ? clean : clean.slice(0, maxLen).trimEnd() + '…';
}

// Normalise author names so "Francis BIREREMBA" and "Francis Bireremba" become one user
function normaliseAuthor(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
    .split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set — check .env');
  pool   = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool as any);
  prisma = new PrismaClient({ adapter } as any);

  // ── 1. Authors (upsert users for each unique blog author) ──────────────────
  console.log('👤 Upserting blog author accounts...');
  const authorNames = [...new Set(OLD_BLOGS.map(b => normaliseAuthor(b.authorName)))];
  const dummyHash   = await bcrypt.hash('Geuza2025!', 10);
  const authorMap   = new Map<string, number>();

  for (const name of authorNames) {
    const email = `${name.toLowerCase().replace(/\s+/g, '.')  }@geuza.africa`;
    const user = await prisma.user.upsert({
      where:  { email },
      update: { name },
      create: { name, email, password: dummyHash, role: 'admin', isVisible: true },
    });
    authorMap.set(name, user.id);
    console.log(`  ✓ Author: ${name} (id=${user.id}, email=${email})`);
  }

  // ── 2. Blog categories ─────────────────────────────────────────────────────
  console.log('\n📂 Upserting blog categories...');
  const blogCategoryNames = ['Impact', 'Story', 'Innovation', 'Partners', 'Community', 'Guide', 'Team', 'Report'];
  for (const name of blogCategoryNames) {
    await prisma.category.upsert({
      where:  { name_type: { name, type: 'blog' } },
      update: {},
      create: { name, type: 'blog', isVisible: true },
    });
    console.log(`  ✓ Blog category: ${name}`);
  }
  // Default category to use for migrated blogs
  const defaultBlogCat = await prisma.category.findFirst({ where: { name: 'Impact', type: 'blog' } });

  // ── 3. Blogs ───────────────────────────────────────────────────────────────
  console.log('\n📝 Seeding blogs...');
  for (const b of OLD_BLOGS) {
    const slug = slugify(b.title);
    const existing = await prisma.blog.findFirst({ where: { slug } });
    if (existing) { console.log(`  ⚠ Skipped (slug exists): ${b.title}`); continue; }

    const authorName = normaliseAuthor(b.authorName);
    const authorId   = authorMap.get(authorName) ?? null;

    const blog = await prisma.blog.create({
      data: {
        title:       b.title,
        slug,
        content:     b.body.replace(/\r\n/g, '\n'),
        excerpt:     excerpt(b.body),
        coverImage:  b.thumbnailImage,
        readTime:    b.minRead,
        authorId,
        categoryId:  defaultBlogCat?.id ?? null,
        status:      'published',
        isVisible:   true,
        publishedAt: new Date(b.createdAt),
        createdAt:   new Date(b.createdAt),
      },
    });
    console.log(`  ✓ Blog: "${blog.title.slice(0, 55)}…" (id=${blog.id})`);
  }

  // ── 4. Partners ────────────────────────────────────────────────────────────
  console.log('\n🤝 Seeding partners...');
  for (const p of OLD_PARTNERS) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (existing) { console.log(`  ⚠ Skipped (exists): ${p.name}`); continue; }
    const partner = await prisma.partner.create({
      data: { name: p.name, logo: p.logo, isVisible: true },
    });
    console.log(`  ✓ Partner: ${partner.name} (id=${partner.id})`);
  }

  // ── 5. Testimonials ────────────────────────────────────────────────────────
  // Old schema had companyName + companyImage (org logo), no person name.
  // We map: name = companyName, company = companyName, avatar = companyImage.
  console.log('\n⭐ Seeding testimonials...');
  for (const t of OLD_TESTIMONIALS) {
    const name = t.companyName.trim();
    const existing = await prisma.testimonial.findFirst({ where: { name } });
    if (existing) { console.log(`  ⚠ Skipped (exists): ${name}`); continue; }
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        company:   name,
        quote:     t.testimonial,
        avatar:    t.companyImage,
        rating:    5,
        featured:  false,
        isVisible: true,
      },
    });
    console.log(`  ✓ Testimonial: ${testimonial.name} (id=${testimonial.id})`);
  }

  console.log('\n✅ All content seeded successfully.');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma?.$disconnect(); await pool?.end(); });
