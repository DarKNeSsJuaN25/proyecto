import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Services from '@/components/landing/Services';
import Doctors from '@/components/landing/Doctors';
import Testimonials from '@/components/landing/Testimonials';
import Blog from '@/components/landing/Blog';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Doctors />
        <Testimonials />
        <Blog />
      </main>
      <Footer />
    </div>
  );
}