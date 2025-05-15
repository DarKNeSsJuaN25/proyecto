'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain } from 'lucide-react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

const doctors = [
  {
    id: 1,
    name: 'Dra. Jennifer Lee',
    specialty: 'Dentista',
    image: 'https://wp-themes.com/wp-content/themes/blockskit-medical-health/assets/images/team-img1.jpg',
    icon: Heart
  },
  {
    id: 2,
    name: 'Dr. Timothy Davis',
    specialty: 'Cardiólogo',
    image: 'https://wp-themes.com/wp-content/themes/blockskit-medical-health/assets/images/team-img3.jpg',
    icon: Brain
  }
];

const Doctors = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-600">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid sm:grid-cols-2 gap-6">
            {doctors.map((doctor) => {
              const Icon = doctor.icon;
              return (
                <Card key={doctor.id} className="bg-white/90 backdrop-blur-sm p-6 text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      width={128}
                      height={128}
                      className="rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{doctor.name}</h3>
                  <Badge variant="secondary">{doctor.specialty}</Badge>
                </Card>
              );
            })}
          </div>
          
          <div className="text-white space-y-6">
            <h2 className="text-4xl font-bold">
              Conoce a Nuestros Doctores Expertos
            </h2>
            <p className="text-lg opacity-90">
              Contamos con los mejores especialistas médicos para cuidar de tu salud.
              Profesionales altamente capacitados con años de experiencia en sus áreas.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="bg-white/20 rounded-full p-1">✓</span>
                Atención médica confiable y accesible
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-white/20 rounded-full p-1">✓</span>
                Especialidades más buscadas
              </li>
            </ul>
            <ShimmerButton className="bg-white text-blue-600 hover:bg-gray-100">
              Ver Todo el Equipo
            </ShimmerButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;