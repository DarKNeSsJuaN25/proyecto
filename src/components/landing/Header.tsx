'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Salud Care
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="#services" className="hover:text-primary transition">
              Servicios
            </Link>
            <Link href="#doctors" className="hover:text-primary transition">
              Doctores
            </Link>
            <Link href="#testimonials" className="hover:text-primary transition">
              Testimonios
            </Link>
            <Link href="#contact" className="hover:text-primary transition">
              Contacto
            </Link>
          </nav>

          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agendar Cita
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;