import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Heart, User, ShoppingBag, ChevronRight, LogOut } from 'lucide-react';
import { fetchOrders } from '../../features/orders/ordersSlice';
import { logout } from '../../features/auth/authSlice';
import { Breadcrumb } from '../../components/common/UI';
import toast from 'react-hot-toast';
import { formatPKR } from '../../utils/currency';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { list: orders } = useSelector((s) => s.orders);
  const wishlistCount = useSelector((s) => s.wishlist.items.length);
  const cartItems = useSelector((s) => s.cart.cart?.items || []);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchOrders());
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/');
  };

  const recentOrders = orders.slice(0, 3);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, link: '/orders', color: 'bg-maroon/10 text-maroon' },
    { label: 'Wishlist Items', value: wishlistCount, icon: Heart, link: '/wishlist', color: 'bg-red-50 text-red-brand' },
    { label: 'Cart Items', value: cartItems.reduce((s, i) => s + i.quantity, 0), icon: ShoppingBag, link: '/cart', color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]} />

      {/* Welcome */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="bg-maroon text-white p-6 md:p-8 mb-8 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-heading font-bold text-2xl">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white/70 text-sm">Welcome back,</p>
              <h1 className="font-heading font-bold text-2xl">{user?.full_name}</h1>
            </div>
          </div>
          <p className="text-white/60 text-sm">{user?.email}</p>
          {user?.role === 'admin' && (
            <Link to="/admin" className="inline-block mt-3 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-sm text-sm font-semibold transition-colors">
              Go to Admin Panel →
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} variants={fadeUp} initial="hidden" animate="visible" custom={i}>
            <Link to={stat.link} className="block bg-white border border-lgray p-4 hover:border-maroon/30 hover:shadow-sm transition-all text-center group">
              <div className={`w-10 h-10 ${stat.color} rounded-sm flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="font-heading font-bold text-2xl">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="md:col-span-2">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="bg-white border border-lgray p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-base">Recent Orders</h2>
              <Link to="/orders" className="text-xs text-maroon hover:underline font-medium">View All</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No orders yet</p>
                <Link to="/products" className="text-maroon text-xs hover:underline mt-1 block">Start Shopping →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link key={order.id} to={`/orders/${order.id}`}
                    className="flex items-center justify-between p-3 hover:bg-lgray/40 transition-colors rounded-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-maroon/10 rounded-sm flex items-center justify-center">
                        <Package size={16} className="text-maroon" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Order #{order.id}</p>
                        <p className="text-xs text-gray-400 capitalize">{order.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-maroon">{formatPKR(order.total_amount)}</span>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-maroon transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <div className="bg-white border border-lgray p-5">
            <h2 className="font-heading font-bold text-base mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Browse Products', to: '/products', icon: ShoppingBag },
                { label: 'My Wishlist', to: '/wishlist', icon: Heart },
                { label: 'My Orders', to: '/orders', icon: Package },
                { label: 'My Profile', to: '/profile', icon: User },
              ].map(({ label, to, icon: Icon }) => (
                <Link key={label} to={to}
                  className="flex items-center gap-3 p-2.5 hover:bg-lgray/50 transition-colors rounded-sm group"
                >
                  <Icon size={16} className="text-maroon" />
                  <span className="text-sm flex-1">{label}</span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-maroon transition-colors" />
                </Link>
              ))}
              <button onClick={handleLogout}
                className="flex items-center gap-3 p-2.5 hover:bg-red-50 transition-colors rounded-sm w-full text-red-brand"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
