import { useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, ChevronRight, TrendingUp, DollarSign, Box } from 'lucide-react';
import { fetchProducts } from '../../features/products/productsSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import { fetchOrders } from '../../features/orders/ordersSlice';
import { formatPKR } from '../../utils/currency';

const navItems = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: Tag },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/'); return; }
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome, {user?.full_name}</p>
      </div>

      {/* Nav tabs */}
      <div className="flex gap-2 flex-wrap mb-8 border-b border-lgray pb-1">
        {navItems.map(({ label, to, icon: Icon, end }) => {
          const active = end ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-button font-semibold tracking-wide transition-colors -mb-px ${
                active ? 'border-b-2 border-maroon text-maroon' : 'text-gray-500 hover:text-dark'
              }`}
              style={{fontFamily:'Montserrat,sans-serif'}}
            >
              <Icon size={15} /> {label}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}

// ── Admin Overview (default /admin route)
export function AdminOverview() {
  const dispatch = useDispatch();
  const { list: products } = useSelector((s) => s.products);
  const { list: categories } = useSelector((s) => s.categories);
  const { list: orders } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchOrders());
  }, []);

  const revenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const pending = orders.filter((o) => o.status === 'pending').length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-maroon/10 text-maroon', to: '/admin/products' },
    { label: 'Categories', value: categories.length, icon: Tag, color: 'bg-blue-50 text-blue-600', to: '/admin/categories' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-purple-50 text-purple-600', to: '/admin/orders' },
    { label: 'Revenue', value: formatPKR(revenue), icon: DollarSign, color: 'bg-green-50 text-green-600', to: '/admin/orders' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link to={s.to} className="block bg-white border border-lgray p-5 hover:border-maroon/30 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${s.color} rounded-sm flex items-center justify-center`}>
                  <s.icon size={20} />
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
              <p className="font-heading font-bold text-2xl">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick info */}
      {pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-700">
            <ShoppingBag size={18} />
            <span className="text-sm font-semibold">{pending} pending order{pending > 1 ? 's' : ''} need attention</span>
          </div>
          <Link to="/admin/orders" className="text-xs text-yellow-700 font-semibold underline">View →</Link>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white border border-lgray p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-base">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-maroon hover:underline">View All</Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-lgray">
                  <th className="text-left py-2 px-3 text-xs font-button tracking-widest uppercase text-gray-400" style={{fontFamily:'Montserrat,sans-serif'}}>Order</th>
                  <th className="text-left py-2 px-3 text-xs font-button tracking-widest uppercase text-gray-400" style={{fontFamily:'Montserrat,sans-serif'}}>Amount</th>
                  <th className="text-left py-2 px-3 text-xs font-button tracking-widest uppercase text-gray-400" style={{fontFamily:'Montserrat,sans-serif'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-lgray hover:bg-lgray/30 transition-colors">
                    <td className="py-3 px-3">
                      <Link to={`/orders/${order.id}`} className="font-semibold hover:text-maroon">#{order.id}</Link>
                    </td>
                    <td className="py-3 px-3 font-medium text-maroon">{formatPKR(order.total_amount)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-semibold capitalize ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700'
                        : order.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                        : order.status === 'cancelled' ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
