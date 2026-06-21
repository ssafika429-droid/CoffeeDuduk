import { X } from 'lucide-react';

interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
  total: number;
  status: string;
  customerName: string;
  tableNumber: string;
  createdAt: string;
}

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--color-brown-100)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--color-coffee-dark)]">
            Detail Pesanan
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--color-coffee-light)] hover:text-[var(--color-coffee-dark)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 bg-[var(--color-cream)] rounded-lg p-4">
            <div>
              <p className="text-sm text-[var(--color-coffee-light)] mb-1">Tanggal Pesanan</p>
              <p className="font-semibold text-[var(--color-coffee-dark)]">
                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-coffee-light)] mb-1">Order ID</p>
              <p className="font-mono text-sm font-semibold text-[var(--color-coffee-dark)]">
                {order.id.slice(0, 8)}...
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-coffee-light)] mb-1">Nama Pelanggan</p>
              <p className="font-semibold text-[var(--color-coffee-dark)]">
                {order.customerName}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-coffee-light)] mb-1">Nomor Meja</p>
              <p className="font-semibold text-[var(--color-coffee-dark)]">
                {order.tableNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-coffee-light)] mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status === 'completed' ? 'Selesai' :
                 order.status === 'pending' ? 'Menunggu' : 'Diproses'}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-bold text-[var(--color-coffee-dark)] mb-4">
              Item Pesanan
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[var(--color-cream)] rounded-lg p-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {item.imageUrl && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--color-coffee-dark)]">
                        {item.name}
                      </p>
                      <p className="text-sm text-[var(--color-coffee-light)]">
                        Rp {item.price.toLocaleString('id-ID')} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-coffee-medium)]">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-[var(--color-brown-200)] pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--color-coffee-light)]">Subtotal</span>
              <span className="font-semibold text-[var(--color-coffee-dark)]">
                Rp {order.total.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold text-[var(--color-coffee-dark)]">Total</span>
              <span className="font-bold text-[var(--color-coffee-medium)] text-2xl">
                Rp {order.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[var(--color-coffee-medium)] text-white rounded-lg font-semibold hover:bg-[var(--color-coffee-dark)] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
