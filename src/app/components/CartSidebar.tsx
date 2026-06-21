import { useState } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartSidebarProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: (customerName: string, tableNumber: string) => void;
}

export default function CartSidebar({
  cart,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartSidebarProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout(customerName, tableNumber);
    setCustomerName('');
    setTableNumber('');
    setShowCheckout(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-brown-100)]">
          <h2 className="text-2xl font-bold text-[var(--color-coffee-dark)]">
            Keranjang Belanja
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--color-coffee-light)] hover:text-[var(--color-coffee-dark)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--color-coffee-light)]">
                Keranjang Anda masih kosong
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 bg-[var(--color-cream)] rounded-lg p-4"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-coffee-dark)] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm font-semibold text-[var(--color-coffee-medium)] mb-2">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--color-coffee-medium)] hover:bg-[var(--color-beige)] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center font-semibold text-[var(--color-coffee-dark)]">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--color-coffee-medium)] hover:bg-[var(--color-beige)] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onRemove(item.productId)}
                        className="ml-auto p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[var(--color-brown-100)] p-6 bg-[var(--color-cream)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-[var(--color-coffee-dark)]">
                Total
              </span>
              <span className="text-2xl font-bold text-[var(--color-coffee-medium)]">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full px-6 py-3 bg-[var(--color-coffee-medium)] text-white rounded-lg font-semibold hover:bg-[var(--color-coffee-dark)] transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-[var(--color-coffee-dark)] mb-6">
              Informasi Pesanan
            </h2>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-coffee-dark)] mb-2">
                  Nomor Meja
                </label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
                  placeholder="Contoh: A1, B2, dll"
                />
              </div>

              <div className="bg-[var(--color-cream)] rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[var(--color-coffee-light)]">Items</span>
                  <span className="font-medium text-[var(--color-coffee-dark)]">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} item
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-[var(--color-coffee-dark)]">
                    Total
                  </span>
                  <span className="text-xl font-bold text-[var(--color-coffee-medium)]">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-6 py-3 border border-[var(--color-brown-200)] text-[var(--color-coffee-dark)] rounded-lg font-semibold hover:bg-[var(--color-cream)] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[var(--color-coffee-medium)] text-white rounded-lg font-semibold hover:bg-[var(--color-coffee-dark)] transition-colors"
                >
                  Konfirmasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
