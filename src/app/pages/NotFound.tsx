import { Coffee } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-4">
      <div className="text-center">
        <Coffee className="w-24 h-24 text-[var(--color-coffee-light)] mx-auto mb-8 opacity-50" />
        <h1 className="text-6xl font-bold text-[var(--color-coffee-dark)] mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-[var(--color-coffee-medium)] mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-[var(--color-coffee-light)] mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-[var(--color-coffee-medium)] text-white rounded-lg font-semibold hover:bg-[var(--color-coffee-dark)] transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
