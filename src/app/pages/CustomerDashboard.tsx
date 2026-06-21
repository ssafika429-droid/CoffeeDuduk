import { useState, useEffect, useMemo } from 'react';
import { Coffee, ShoppingCart, LogOut, User, TrendingUp, Heart, DollarSign, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';
import { auth } from '../utils/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  customerName: string;
  tableNumber: string;
  createdAt: string;
}

const PRODUCTS_PER_PAGE = 6;

const STATUS_LABELS: Record<string, string> = {
  completed: 'Selesai',
  pending: 'Menunggu',
  processing: 'Diproses',
  ready: 'Siap',
};

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  ready: 'bg-orange-100 text-orange-800',
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpending: 0 });
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const session = await auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }

      const { user: userData } = await api.getMe();
      setUser(userData);

      const { products: productsData } = await api.getProducts();
      setProducts(productsData || []);

      const { stats: statsData } = await api.getCustomerStats();
      setStats(statsData);

      const { orders: ordersData } = await api.getMyOrders();
      setOrders(ordersData || []);
    } catch (error: any) {
      console.error('Load data error:', error);
      toast.error('Gagal memuat data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    toast.success('Berhasil logout');
    navigate('/');
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      }]);
    }
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const handleCheckout = async (customerName: string, tableNumber: string) => {
    try {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await api.createOrder({ items: cart, total, customerName, tableNumber });
      toast.success('Pesanan berhasil dibuat!');
      setCart([]);
      setShowCart(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat pesanan');
    }
  };

  const favoriteCoffee = useMemo(() => {
    if (!orders.length) return '-';
    const counts: Record<string, number> = {};
    for (const order of orders) {
      for (const item of order.items) {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      }
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? '-';
  }, [orders]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-[var(--color-coffee-medium)] animate-pulse mx-auto mb-4" />
          <p className="text-[var(--color-coffee-light)]">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Coffee className="w-8 h-8 text-[var(--color-coffee-medium)]" />
              <span className="text-2xl font-bold text-[var(--color-coffee-dark)]">KopiDuduk</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-[var(--color-coffee-medium)] hover:text-[var(--color-coffee-dark)] transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-coffee-medium)] text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-beige)] rounded-full hover:bg-[var(--color-beige-dark)] transition-colors"
                >
                  <User className="w-5 h-5 text-[var(--color-coffee-medium)]" />
                  <span className="text-[var(--color-coffee-dark)] font-medium hidden sm:inline">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-coffee-medium)]" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-[var(--color-brown-100)]">
                      <p className="text-sm font-medium text-[var(--color-coffee-dark)]">{user?.name}</p>
                      <p className="text-xs text-[var(--color-coffee-light)]">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-[var(--color-coffee-light)] hover:bg-[var(--color-cream)] transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-coffee-dark)] mb-2">
            Selamat Datang, {user?.name}!
          </h1>
          <p className="text-[var(--color-coffee-light)]">Pesan kopi favorit Anda hari ini</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-coffee-light)] mb-1">Total Pesanan</p>
                <p className="text-3xl font-bold text-[var(--color-coffee-dark)]">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-[var(--color-beige)] rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[var(--color-coffee-medium)]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-coffee-light)] mb-1">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-[var(--color-coffee-dark)]">
                  Rp {stats.totalSpending.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--color-beige)] rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[var(--color-coffee-medium)]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-coffee-light)] mb-1">Kopi Favorit</p>
                <p className="text-xl font-bold text-[var(--color-coffee-dark)] truncate max-w-[140px]">
                  {favoriteCoffee}
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--color-beige)] rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-[var(--color-coffee-medium)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-coffee-dark)]">Menu Kopi Kami</h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-coffee-light)]" />
              <input
                type="text"
                placeholder="Cari kopi..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)] bg-white text-sm"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Coffee className="w-16 h-16 text-[var(--color-brown-200)] mx-auto mb-4" />
              <p className="text-[var(--color-coffee-light)]">Produk tidak ditemukan</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[var(--color-brown-200)] hover:bg-[var(--color-beige)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[var(--color-coffee-medium)]" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-[var(--color-coffee-medium)] text-white'
                          : 'border border-[var(--color-brown-200)] text-[var(--color-coffee-medium)] hover:bg-[var(--color-beige)]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-[var(--color-brown-200)] hover:bg-[var(--color-beige)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-[var(--color-coffee-medium)]" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-coffee-dark)] mb-6">Riwayat Pesanan</h2>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Coffee className="w-16 h-16 text-[var(--color-brown-200)] mx-auto mb-4" />
              <p className="text-[var(--color-coffee-light)]">Belum ada riwayat pesanan</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-beige)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">Tanggal</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">Nama</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">Meja</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">Items</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-brown-100)]">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[var(--color-cream)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-coffee-light)]">
                          {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-coffee-dark)]">{order.customerName}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-coffee-dark)]">{order.tableNumber}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-coffee-light)]">{order.items.length} item</td>
                        <td className="px-6 py-4 text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Rp {order.total.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                            {STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCart && (
        <CartSidebar
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}
