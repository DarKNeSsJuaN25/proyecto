'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Marquee } from '@/components/magicui/marquee';

const testimonials = [
  {
    id: 1,
    name: 'Jonas Scottman',
    role: 'Paciente',
    comment: 'Excelente atención médica. Los doctores son muy profesionales y el personal es amable. Me sentí muy bien cuidado durante todo mi tratamiento.',
    rating: 5,
    image: 'https://wp-themes.com/wp-content/themes/blockskit-medical-health/assets/images/review-img1.jpg'
  },
  {
    id: 2,
    name: 'María García',
    role: 'Paciente',
    comment: 'Mi experiencia fue excepcional. Desde la recepción hasta el tratamiento, todo fue de primera calidad. Definitivamente recomendaría esta clínica.',
    rating: 5,
    image: 'https://wp-themes.com/wp-content/themes/blockskit-medical-health/assets/images/review-img2.jpg'
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <Card className="bg-blue-50 border-none mx-3">
    <CardContent className="p-6 space-y-4">
      <div className="flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-600 italic">"{testimonial.comment}"</p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h4 className="font-semibold">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Lo Que Dicen Nuestros Pacientes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conoce las experiencias de nuestros pacientes y descubre por qué somos 
            la mejor opción para el cuidado de tu salud.
          </p>
        </div>
        
        <Marquee className="py-4" pauseOnHover>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
          {testimonials.map((testimonial) => (
            <TestimonialCard key={`${testimonial.id}-copy`} testimonial={testimonial} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Testimonials;