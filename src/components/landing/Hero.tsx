"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { NumberTicker } from "@/components/magicui/number-ticker";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="pt-32 pb-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <SparklesText className="text-5xl font-bold">
              El Mejor Servicio Médico Confiable
            </SparklesText>
            <p className="text-lg text-gray-600">
              Comprometidos con tu salud y bienestar. Ofrecemos atención médica
              integral con los mejores especialistas y tecnología de vanguardia
              para cuidar de ti y tu familia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex items-center gap-2"
                onClick={() => router.push("/dashboard")}
              >
                Saber Más
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Contáctanos
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-blue-100 rounded-full w-[400px] h-[400px] mx-auto relative">
              <img
                src="https://wp-themes.com/wp-content/themes/blockskit-medical-health/assets/images/banner-img1.png"
                alt="Profesional Médico"
                width={400}
                height={400}
                className="rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
