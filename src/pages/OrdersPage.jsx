import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import { fetchOrders } from '../features/orders/ordersSlice';
import { Breadcrumb, EmptyState, PageLoader } from '../components/common/UI';
import { formatPKR } from '../utils/currency';

const statusConfig = {
  pending:    { label: 'Pending',    icon: Clock,         color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  processing: { label: 'Processing', icon: AlertCircle,   color: 'text-blue-600 bg-blue-50 border-blue-200' },
  shipped:    { label: 'Shipped',    icon: Truck,         color: 'text-purple-600 bg-purple-50 border-purple-200' },
  delivered:  { label: 'Delivered',  icon: CheckCircle,   color: 'text-green-600 bg-green-50 border-green-200' },
  cancelled:  { label: 'Cancelled',  icon: XCircle,       color: 'text-red-600 bg-red-50 border-red-200' },
};

const timelineSteps = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: orders, loading } = useSelector((s) => s.orders);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchOrders());
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'Orders' }]} />
      <h1 className="section-title mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          message="You haven't placed any orders yet. Start shopping!"
          action="/products"
          actionLabel="Shop Now"
        />
      ) : (
        <div className="space-y-5">
          {orders.map((order, i) => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            const stepIdx = timelineSteps.indexOf(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-lgray p-5 hover:border-maroon/30 hover:shadow-sm transition-all"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-bold text-base">Order #{order.id}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${cfg.color}`}>
                        <StatusIcon size={12} />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Placed on {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-xl text-maroon">{formatPKR(order.total_amount)}</p>
                    <p className="text-xs text-gray-400">{order.order_items?.length || 0} item(s)</p>
                  </div>
                </div>

                {/* Timeline */}
                {order.status !== 'cancelled' && (
                  <div className="flex items-center mb-4">
                    {timelineSteps.map((s, idx) => (
                      <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${idx <= stepIdx ? 'bg-maroon text-white' : 'bg-lgray text-gray-400'}`}>
                          {idx < stepIdx ? <CheckCircle size={14} /> : idx + 1}
                        </div>
                        {idx < timelineSteps.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 transition-colors ${idx < stepIdx ? 'bg-maroon' : 'bg-lgray'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Items preview */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {order.order_items.slice(0, 3).map((item) => (
                      <div key={item.id} className="text-xs bg-lgray/50 px-2.5 py-1 rounded-sm">
                        {item.product?.name || `Product #${item.product_id}`}
                        <span className="text-gray-400 ml-1">×{item.quantity}</span>
                      </div>
                    ))}
                    {order.order_items.length > 3 && (
                      <div className="text-xs bg-lgray/50 px-2.5 py-1 rounded-sm text-gray-500">
                        +{order.order_items.length - 3} more
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-lgray">
                  <div className="flex gap-3">
                    <Link to={`/orders/${order.id}`} className="flex items-center gap-1 text-sm text-maroon font-medium hover:underline">
                      View Details <ChevronRight size={14} />
                    </Link>
                  </div>
                  {order.status === 'delivered' && (
                    <Link to="/products" className="text-xs btn-outline py-1.5 px-3">Buy Again</Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
