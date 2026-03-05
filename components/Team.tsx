import React from 'react';
import Image from 'next/image';
import { SectionHeader } from './ui';

const teamMembers = [
  {
    id: 1,
    name: 'Aline Nicole Uwamariya',
    role: 'Co-Founder & CEO',
    image: '/images/team/member1.png',
  },
  {
    id: 2,
    name: 'Abdoulrahman Niyonizeye',
    role: 'Co-Founder & Business Growth Lead',
    image: '/images/team/member2.png',
  },
  {
    id: 3,
    name: 'Marie Noelle Kanyamuneza',
    role: 'Technical Manager',
    image: '/images/team/member3.png',
  },
  {
    id: 4,
    name: 'Ariane Mukeshimana',
    role: 'Operational Manager',
    image: '/images/team/member4.png',
  },
];

export default function Team() {
  return (
    <section id="team" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <SectionHeader title="Team" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="text-center group">
              <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
