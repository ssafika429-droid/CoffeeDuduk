import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: any) => void;
}

export default function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: product.description,
        imageUrl: product.imageUrl,
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--color-brown-100)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--color-coffee-dark)]">
            {product ? 'Edit Produk' : 'Tambah Produk'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--color-coffee-light)] hover:text-[var(--color-coffee-dark)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
              Nama Produk
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
              placeholder="Contoh: Espresso"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
                Harga (Rp)
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
                placeholder="25000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
                Stok
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
                placeholder="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
              Deskripsi
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)] resize-none"
              placeholder="Deskripsi produk..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
              URL Gambar
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden border border-[var(--color-brown-200)]">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[var(--color-brown-200)] text-[var(--color-coffee-dark)] rounded-lg font-semibold hover:bg-[var(--color-cream)] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[var(--color-coffee-medium)] text-white rounded-lg font-semibold hover:bg-[var(--color-coffee-dark)] transition-colors"
            >
              {product ? 'Update' : 'Tambah'} Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
