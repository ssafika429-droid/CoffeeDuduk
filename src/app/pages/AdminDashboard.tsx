import { useState, useEffect } from 'react';
import { Coffee, Package, ShoppingBag, DollarSign, Users, LogOut, Menu, X, Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { api } from '../utils/api';
import { auth } from '../utils/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import ProductForm from '../components/ProductForm';
import OrderDetailModal from '../components/OrderDetailModal';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  customerName: string;
  tableNumber: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      
      if (userData.role !== 'admin') {
        toast.error('Akses ditolak. Anda bukan admin.');
        navigate('/customer');
        return;
      }
      
      setUser(userData);

      const { products: productsData } = await api.getProducts();
      setProducts(productsData || []);

      const { orders: ordersData } = await api.getAllOrders();
      setOrders(ordersData || []);

      const { stats: statsData } = await api.getAdminStats();
      setStats(statsData);
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

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
        toast.success('Produk berhasil diupdate');
      } else {
        await api.createProduct(productData);
        toast.success('Produk berhasil ditambahkan');
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      loadData();
    } catch (error: any) {
      console.error('Save product error:', error);
      toast.error(error.message || 'Gagal menyimpan produk');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      await api.deleteProduct(id);
      toast.success('Produk berhasil dihapus');
      loadData();
    } catch (error: any) {
      console.error('Delete product error:', error);
      toast.error(error.message || 'Gagal menghapus produk');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      toast.success('Status pesanan berhasil diupdate');
      loadData();
    } catch (error: any) {
      console.error('Update order status error:', error);
      toast.error(error.message || 'Gagal mengupdate status pesanan');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-[var(--color-cream)] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--color-coffee-dark)] text-white transform transition-transform duration-300 ${
        showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Coffee className="w-8 h-8" />
            <span className="text-2xl font-bold">KopiDuduk</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setShowSidebar(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[var(--color-coffee-medium)]'
                  : 'hover:bg-[var(--color-coffee-medium)]/50'
              }`}
            >
              <Package className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setShowSidebar(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'products'
                  ? 'bg-[var(--color-coffee-medium)]'
                  : 'hover:bg-[var(--color-coffee-medium)]/50'
              }`}
            >
              <Coffee className="w-5 h-5" />
              Produk
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setShowSidebar(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[var(--color-coffee-medium)]'
                  : 'hover:bg-[var(--color-coffee-medium)]/50'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Pesanan
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-[var(--color-coffee-medium)]">
          <div className="mb-4">
            <p className="text-sm text-[var(--color-brown-200)]">Logged in as</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-coffee-medium)]/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-md px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 text-[var(--color-coffee-medium)]"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-[var(--color-coffee-dark)]">
                Admin Dashboard
              </h1>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-coffee-dark)] mb-6">
                Ringkasan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-coffee-light)] mb-1">Total Produk</p>
                  <p className="text-3xl font-bold text-[var(--color-coffee-dark)]">
                    {stats.totalProducts}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-coffee-light)] mb-1">Total Pesanan</p>
                  <p className="text-3xl font-bold text-[var(--color-coffee-dark)]">
                    {stats.totalOrders}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-coffee-light)] mb-1">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-[var(--color-coffee-dark)]">
                    Rp {stats.totalRevenue.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-coffee-light)] mb-1">Total Customer</p>
                  <p className="text-3xl font-bold text-[var(--color-coffee-dark)]">
                    {stats.totalCustomers}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-[var(--color-coffee-dark)] mb-4">
                  Pesanan Terbaru
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[var(--color-beige)]">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Pelanggan
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-brown-100)]">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-[var(--color-cream)] transition-colors">
                          <td className="px-4 py-3 text-sm text-[var(--color-coffee-light)]">
                            {new Date(order.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--color-coffee-dark)]">
                            {order.customerName}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-[var(--color-coffee-dark)]">
                            Rp {order.total.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'ready'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status === 'completed' ? 'Selesai' :
                               order.status === 'pending' ? 'Menunggu' :
                               order.status === 'ready' ? 'Siap' : 'Diproses'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-coffee-dark)]">
                  Manajemen Produk
                </h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-coffee-medium)] text-white rounded-lg hover:bg-[var(--color-coffee-dark)] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Produk
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-coffee-light)]" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[var(--color-brown-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-coffee-medium)]"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[var(--color-beige)]">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Produk
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Harga
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Stok
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Deskripsi
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-brown-100)]">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-[var(--color-cream)] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-beige)]">
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium text-[var(--color-coffee-dark)]">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[var(--color-coffee-dark)]">
                            Rp {product.price.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--color-coffee-dark)]">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--color-coffee-light)] max-w-xs truncate">
                            {product.description}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowProductForm(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-coffee-dark)] mb-6">
                Manajemen Pesanan
              </h2>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[var(--color-beige)]">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Pelanggan
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Meja
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-[var(--color-coffee-dark)]">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-brown-100)]">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-[var(--color-cream)] transition-colors">
                          <td className="px-6 py-4 text-sm text-[var(--color-coffee-light)]">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-[var(--color-coffee-dark)]">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--color-coffee-dark)]">
                            {order.tableNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--color-coffee-light)]">
                            {order.items.length} item
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[var(--color-coffee-dark)]">
                            Rp {order.total.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'ready'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="ready">Ready</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 text-[var(--color-coffee-medium)] hover:bg-[var(--color-beige)] rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
