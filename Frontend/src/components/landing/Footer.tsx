'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Blueshift Medical Health</h3>
            <p className="text-blue-100">
              Comprometidos con tu salud y bienestar, ofrecemos servicios médicos
              de calidad con profesionales altamente capacitados para toda tu familia.
            </p>
            <div className="flex gap-4 mt-6">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-blue-200" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-blue-200" />
              <Youtube className="h-5 w-5 cursor-pointer hover:text-blue-200" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-blue-200" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">PRODUCTOS</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-blue-200">Lista de Portfolio</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Planes y Precios</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Servicios</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Socios</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">COMPAÑÍA</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-blue-200">Acerca de Nosotros</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Nuestras Noticias</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Contáctanos</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Conoce Nuestro Equipo</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">RECURSOS</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-blue-200">Galería</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Artículos del Blog</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Recursos de Marca</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Guías de Marca</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">SOPORTE</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-blue-200">Base de Conocimientos</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Política de Privacidad</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Contactar Soporte</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Términos de Servicio</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-400 pt-8 text-center text-blue-100">
          <p>Copyright © 2023 • Salud Care • Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;