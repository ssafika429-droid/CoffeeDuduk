import { useState } from 'react';
import { X } from 'lucide-react';
import { auth } from '../utils/supabase';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'customer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { session } = await auth.signIn(formData.email, formData.password);
        if (session) {
          const { user } = await api.getMe();
          localStorage.setItem('user', JSON.stringify(user));
          
          toast.success('Login berhasil!');
          onClose();
          
          // Redirect based on role
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/customer');
          }
        }
      } else {
        // Register
        const { user } = await api.register(
          formData.email,
          formData.password,
          formData.name,
          formData.role
        );
        
        toast.success('Registrasi berhasil! Silakan login.');
        setIsLogin(true);
        setFormData({ ...formData, password: '' });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-coffee-light)] hover:text-[var(--color-coffee-dark)] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-[var(--color-coffee-dark)] mb-2">
            {isLogin ? 'Masuk' : 'Daftar'}
          </h2>
          <p className="text-[var(--color-coffee-light)] mb-8">
            {isLogin
              ? 'Masuk ke akun Anda untuk melanjutkan'
              : 'Buat akun baru untuk mulai memesan'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
                placeholder="Masukkan password"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
                  Daftar sebagai
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[var(--color-coffee-medium)] text-white rounded-lg font-semibold hover:bg-[var(--color-coffee-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--color-coffee-light)]">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[var(--color-coffee-medium)] font-semibold hover:text-[var(--color-coffee-dark)] transition-colors"
              >
                {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
