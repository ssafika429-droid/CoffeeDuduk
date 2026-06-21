import { useState, useEffect } from 'react';
import { Coffee, Clock, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import AuthModal from '../components/AuthModal';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { seedDatabase } from '../utils/seed';
import { auth } from '../utils/supabase';
import { api } from '../utils/api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  const handlePesanSekarang = async () => {
    try {
      const session = await auth.getSession();
      if (session) {
        const { user } = await api.getMe();
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/customer');
        }
      } else {
        setShowAuthModal(true);
      }
    } catch {
      setShowAuthModal(true);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Coffee className="w-8 h-8 text-[var(--color-coffee-medium)]" />
              <span className="text-2xl font-bold text-[var(--color-coffee-dark)]">
                KopiDuduk
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('about')}
                className="text-[var(--color-coffee-light)] hover:text-[var(--color-coffee-dark)] transition-colors"
              >
                Tentang
              </button>
              <button
                onClick={() => scrollToSection('benefits')}
                className="text-[var(--color-coffee-light)] hover:text-[var(--color-coffee-dark)] transition-colors"
              >
                Manfaat
              </button>
              <button
                onClick={() => scrollToSection('team')}
                className="text-[var(--color-coffee-light)] hover:text-[var(--color-coffee-dark)] transition-colors"
              >
                Tim
              </button>
              <button
                onClick={handlePesanSekarang}
                className="px-6 py-2 bg-[var(--color-coffee-medium)] text-white rounded-full hover:bg-[var(--color-coffee-dark)] transition-colors"
              >
                Masuk
              </button>
            </div>

            <button
              onClick={handlePesanSekarang}
              className="md:hidden px-4 py-2 bg-[var(--color-coffee-medium)] text-white rounded-full"
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-beige)] py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--color-coffee-dark)] mb-6">
                Pesan Kopi Online, <br />
                Nikmati di Tempat
              </h1>
              <p className="text-lg text-[var(--color-coffee-light)] mb-8 leading-relaxed">
                KopiDuduk adalah platform pemesanan kopi online yang memudahkan Anda untuk memesan 
                kopi favorit dan menikmatinya langsung di tempat. Tanpa antri, tanpa ribet, 
                hanya kenikmatan kopi yang Anda tunggu-tunggu.
              </p>
              <button
                onClick={handlePesanSekarang}
                className="px-8 py-4 bg-[var(--color-coffee-medium)] text-white rounded-full text-lg font-semibold hover:bg-[var(--color-coffee-dark)] transition-all shadow-lg hover:shadow-xl"
              >
                Pesan Sekarang
              </button>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1598959652545-c0230cdbb01f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3IlMjB3YXJtfGVufDF8fHx8MTc4MTYxOTc2OXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Coffee Shop Interior"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-coffee-dark)] mb-4">
              Tentang KopiDuduk
            </h2>
            <p className="text-lg text-[var(--color-coffee-light)] max-w-2xl mx-auto">
              Kami adalah solusi modern untuk pecinta kopi yang menghargai waktu dan kualitas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1597018990612-969bb248a215?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiYXJpc3RhJTIwc2VydmluZ3xlbnwxfHx8fDE3ODE2NjgyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Barista serving coffee"
                className="w-full h-[400px] object-cover"
              />
            </div>
            
            <div>
              <p className="text-[var(--color-coffee-light)] text-lg mb-6 leading-relaxed">
                KopiDuduk didirikan dengan visi untuk menghadirkan pengalaman menikmati kopi yang 
                lebih efisien dan menyenangkan. Kami memahami bahwa waktu Anda berharga, 
                sehingga kami menciptakan sistem pemesanan yang cepat dan mudah.
              </p>
              <p className="text-[var(--color-coffee-light)] text-lg mb-6 leading-relaxed">
                Dengan teknologi pemesanan online, Anda dapat memesan kopi favorit dari mana saja 
                dan kapan saja. Pesanan Anda akan disiapkan oleh barista profesional kami, 
                siap untuk dinikmati ketika Anda tiba.
              </p>
              <p className="text-[var(--color-coffee-light)] text-lg leading-relaxed">
                Nikmati kopi berkualitas tinggi tanpa harus menunggu lama dalam antrian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-coffee-dark)] mb-4">
              Manfaat KopiDuduk
            </h2>
            <p className="text-lg text-[var(--color-coffee-light)] max-w-2xl mx-auto">
              Nikmati berbagai kemudahan yang kami tawarkan untuk pengalaman kopi terbaik Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[var(--color-beige)] rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-[var(--color-coffee-medium)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-coffee-dark)] mb-4">
                Pesan Lebih Cepat
              </h3>
              <p className="text-[var(--color-coffee-light)] leading-relaxed">
                Pesan kopi favorit Anda hanya dalam hitungan detik melalui platform kami. 
                Tidak perlu antri panjang atau menunggu lama.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[var(--color-beige)] rounded-full flex items-center justify-center mb-6">
                <Coffee className="w-8 h-8 text-[var(--color-coffee-medium)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-coffee-dark)] mb-4">
                Minum di Tempat
              </h3>
              <p className="text-[var(--color-coffee-light)] leading-relaxed">
                Nikmati kopi Anda di tempat kami yang nyaman dan cozy. 
                Suasana yang sempurna untuk bersantai atau bekerja.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[var(--color-beige)] rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-[var(--color-coffee-medium)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-coffee-dark)] mb-4">
                Pelayanan Praktis
              </h3>
              <p className="text-[var(--color-coffee-light)] leading-relaxed">
                Sistem yang efisien memastikan pesanan Anda siap tepat waktu. 
                Hemat waktu untuk hal-hal yang lebih penting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-coffee-dark)] mb-4">
              Tim Kami
            </h2>
            <p className="text-lg text-[var(--color-coffee-light)] max-w-2xl mx-auto">
              Bertemu dengan orang-orang di balik layar yang membuat sistem ini berjalan (kadang-kadang)
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Anggota 1: Elis Safika */}
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-lg bg-gray-100">
                <ImageWithFallback
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Elis"
                  alt="Elis Safika"
                  className="w-full h-full object-cover p-2"
                />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-coffee-dark)] mb-1">
                Elis Safika
              </h3>
              <p className="text-xs text-[var(--color-coffee-light)] mb-2 font-mono">
                NIM: 13182420138
              </p>
              <p className="text-[var(--color-coffee-medium)] font-medium mb-2">
                Frontend Abal-Abal
              </p>
              <p className="text-sm text-[var(--color-coffee-light)]">
                Pawang CSS Gradient yang hobi gonta-ganti aset logo di detik-detik terakhir pengumpulan.
              </p>
            </div>

            {/* Anggota 2: Ahmad Ibrahim */}
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-lg bg-gray-100">
                <ImageWithFallback
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Ahmad"
                  alt="Ahmad Ibrahim"
                  className="w-full h-full object-cover p-2"
                />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-coffee-dark)] mb-1">
                Ahmad Ibrahim
              </h3>
              <p className="text-xs text-[var(--color-coffee-light)] mb-2 font-mono">
                NIM: 13182420157
              </p>
              <p className="text-[var(--color-coffee-medium)] font-medium mb-2">
                Tim Terima Jadi
              </p>
              <p className="text-sm text-[var(--color-coffee-light)]">
                Spesialis seksi konsumsi rapat yang tiba-tiba muncul pas presentasi bawa slide powerpoint heroik.
              </p>
            </div>

            {/* Anggota 3: Yorazaki Gusi */}
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-lg bg-gray-100">
                <ImageWithFallback
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Yorazaki"
                  alt="Yorazaki Gusi"
                  className="w-full h-full object-cover p-2"
                />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-coffee-dark)] mb-1">
                Yorazaki Gusi
              </h3>
              <p className="text-xs text-[var(--color-coffee-light)] mb-2 font-mono">
                NIM: 13182420128
              </p>
              <p className="text-[var(--color-coffee-medium)] font-medium mb-2">
                StackOverflow Engineer
              </p>
              <p className="text-sm text-[var(--color-coffee-light)]">
                Master Copas kode. Mengatasi error dengan doa dan jurus "Ctrl+C, Ctrl+V" tingkat tinggi.
              </p>
            </div>

            {/* Anggota 4: Muhammad Khairul Ni'zam */}
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-lg bg-gray-100">
                <ImageWithFallback
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Khairul"
                  alt="Muhammad Khairul Ni'zam"
                  className="w-full h-full object-cover p-2"
                />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-coffee-dark)] mb-1">
                M. Khairul Ni'zam
              </h3>
              <p className="text-xs text-[var(--color-coffee-light)] mb-2 font-mono">
                NIM: 13182420167
              </p>
              <p className="text-[var(--color-coffee-medium)] font-medium mb-2">
                Database Destroyer
              </p>
              <p className="text-sm text-[var(--color-coffee-light)]">
                "Bisa jalan di lokal kok" adalah kalimat andalannya sebelum bikin database tim langsung drop.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-coffee-dark)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Coffee className="w-8 h-8" />
                <span className="text-2xl font-bold">KopiDuduk</span>
              </div>
              <p className="text-[var(--color-brown-200)]">
                Platform pemesanan kopi online untuk pengalaman menikmati kopi yang lebih baik.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Navigasi</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="text-[var(--color-brown-200)] hover:text-white transition-colors"
                  >
                    Tentang
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('benefits')}
                    className="text-[var(--color-brown-200)] hover:text-white transition-colors"
                  >
                    Manfaat
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('team')}
                    className="text-[var(--color-brown-200)] hover:text-white transition-colors"
                  >
                    Tim
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-[var(--color-brown-200)]">
                <li>Email: info@kopiduduk.com</li>
                <li>Telepon: (021) 1234-5678</li>
                <li>Alamat: Jl. Kopi No. 123, Jakarta</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--color-coffee-medium)] mt-8 pt-8 text-center text-[var(--color-brown-200)]">
            <p>&copy; 2026 KopiDuduk. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}