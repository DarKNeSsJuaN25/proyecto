'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Vale Más Que Mil Palabras',
    date: '17 de Octubre, 2008',
    category: 'Salud',
    content: 'Neccesitattibus hymenaeos facilisi earem faucgai augue nihil busbar soluta a...',
    link: '#'
  },
  {
    id: 2,
    title: 'Elementos',
    date: '5 de Septiembre, 2008',
    category: 'Medicina',
    content: 'El propósito de este artículo es ayudar a determinar cuáles son los ajustes predeterminados...',
    link: '#'
  },
  {
    id: 3,
    title: 'Más Etiquetas',
    date: '21 de Junio, 2008',
    category: 'Fotos',
    content: 'Más publicaciones necesitan etiquetas.',
    link: '#'
  }
];

const Blog = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-4xl font-bold text-blue-900">
              Mantente Actualizado Con<br />Noticias y Blog.
            </h2>
            <p className="text-gray-600">
              Necessitatibus hymenaeos facilisi earum faucgi augue nihil busbar soluta a, 
              iodales quiam posuerture sed unperdistae volputon imperdeit ipsam posuere bibendum upsa.
            </p>
            <div className="flex gap-4">
              <Button variant="outline">Actualizar Noticias</Button>
              <Button variant="outline">Actualizar Artículos</Button>
            </div>
            <Button className="w-full">Ver Todas las Noticias</Button>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-blue-900">
                        {post.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {post.date} • {post.category}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{post.content}</p>
                  <Link 
                    href={post.link} 
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-2 font-medium"
                  >
                    LEER MÁS
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;