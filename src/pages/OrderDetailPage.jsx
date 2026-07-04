import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, CheckCircle, Truck, Clock, XCircle, AlertCircle } from 'lucide-react';
import { fetchOrderById } from '../features/orders/ordersSlice';
import { Breadcrumb, PageLoader } from '../components/common/UI';
import { formatPKR } from '../utils/currency';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const statusConfig = {
  pending:    { label: 'Pending',    icon: Clock,       color: 'text-yellow-600 bg-yellow-50' },
  processing: { label: 'Processing', icon: AlertCircle, color: 'text-blue-600 bg-blue-50' },
  shipped:    { label: 'Shipped',    icon: Truck,       color: 'text-purple-600 bg-purple-50' },
  delivered:  { label: 'Delivered',  icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  cancelled:  { label: 'Cancelled',  icon: XCircle,     color: 'text-red-600 bg-red-50' },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: order, loading } = useSelector((s) => s.orders);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchOrderById(id));
  }, [id]);

  if (loading || !order) return <PageLoader />;

  const cfg = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Orders', href: '/orders' }, { label: `Order #${order.id}` }]} />

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl">Order #{order.id}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Placed on {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${cfg.color}`}>
          <StatusIcon size={14} /> {cfg.label}
        </span>
      </div>

      <div className="space-y-5">
        {/* Items */}
        <div className="bg-white border border-lgray p-5">
          <h2 className="font-heading font-semibold text-base mb-4">Order Items</h2>
          <div className="space-y-4">
            {(order.order_items || []).map((item) => {
              const img = item.product?.image_url ? `${BASE_URL}${item.product.image_url}` : null;
              return (
                <div key={item.id} className="flex gap-4 items-center py-3 border-b border-lgray last:border-0">
                  <div className="w-16 h-20 bg-lgray flex-shrink-0 overflow-hidden">
                    {img ? <img src={img} alt={item.product?.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-gray-300" /></div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.product?.name || `Product #${item.product_id}`}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                    <p className="text-xs text-gray-500">Price at order: {formatPKR(item.price)}</p>
                  </div>
                  <p className="font-heading font-bold text-maroon">{formatPKR(item.price * item.quantity)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white border border-lgray p-5">
          <h2 className="font-heading font-semibold text-base mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPKR(order.total_amount)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-green-600">FREE</span></div>
            <div className="flex justify-between font-heading font-bold text-base pt-2 border-t border-lgray">
              <span>Total</span><span className="text-maroon">{formatPKR(order.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
