'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Brain, Bone, Scissors } from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';

const services = [
  {
    id: 1,
    title: 'Cardiología',
    description: 'Especialistas en el cuidado del corazón y sistema cardiovascular.',
    icon: Heart,
    color: 'text-red-500'
  },
  {
    id: 2,
    title: 'Neurología',
    description: 'Diagnóstico y tratamiento de enfermedades del sistema nervioso.',
    icon: Brain,
    color: 'text-blue-500'
  },
  {
    id: 3,
    title: 'Ortopedia',
    description: 'Atención especializada en huesos, articulaciones y músculos.',
    icon: Bone,
    color: 'text-green-500'
  },
  {
    id: 4,
    title: 'Cirugía',
    description: 'Procedimientos quirúrgicos con tecnología de vanguardia.',
    icon: Scissors,
    color: 'text-purple-500'
  }
];

const Services = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Ofrecemos Nuestros Mejores Servicios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Brindamos atención médica integral con profesionales altamente calificados 
            en diversas especialidades para cuidar de tu salud y bienestar.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <BorderBeam size={250} duration={12} delay={9} />
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`${service.color} mx-auto bg-blue-50 rounded-full p-4 w-16 h-16 flex items-center justify-center`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition">
            Ver Todos los Servicios
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;