import Image from 'next/image';

// Company page shows three key team members
const members = [
  {
    name: 'Aline Nicole Uwamariya',
    role: 'Co-Founder & CEO',
    image: '/images/team/member1.png',
  },
  {
    name: 'Abdoulrahman Niyonizeye',
    role: 'Co-Founder & Business Growth Lead',
    image: '/images/team/member2.png',
  },
  {
    name: 'Ariane Mukeshimana',
    role: 'Operational Manager',
    image: '/images/team/member4.png',
  },
];

export default function CompanyTeam() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Section title — centered, matching design */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            Meet Our Team
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {members.map((member) => (
            <div key={member.name} className="text-center group">
              <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                {member.name}
              </h3>
              <p className="text-gray-500 text-xs mt-1">{member.role}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
