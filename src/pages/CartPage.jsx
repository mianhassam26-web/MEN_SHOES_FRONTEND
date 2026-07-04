import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { fetchCart, removeFromCart } from '../features/cart/cartSlice';
import { Breadcrumb, EmptyState, PageLoader } from '../components/common/UI';
import toast from 'react-hot-toast';
import { formatPKR } from '../utils/currency';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchCart());
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId)).then((res) => {
      if (!res.error) toast.success('Item removed');
    });
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <h1 className="section-title mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Add items from the shop to get started."
          action="/products"
          actionLabel="Browse Products"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-lgray text-xs font-button font-semibold tracking-widest uppercase text-gray-400" style={{fontFamily:'Montserrat,sans-serif'}}>
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <AnimatePresence>
              {items.map((item) => {
                const imgUrl = item.product?.image_url ? `${BASE_URL}${item.product.image_url}` : null;
                return (
                  <motion.div
                    key={item.id} layout
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-12 gap-4 items-center py-5 border-b border-lgray"
                  >
                    {/* Product */}
                    <div className="col-span-12 sm:col-span-6 flex gap-4">
                      <Link to={`/products/${item.product?.id}`}>
                        <div className="w-20 h-24 bg-lgray flex-shrink-0 overflow-hidden">
                          {imgUrl ? (
                            <img src={imgUrl} alt={item.product?.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={20} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div>
                        <Link to={`/products/${item.product?.id}`} className="font-heading font-semibold text-sm hover:text-maroon transition-colors line-clamp-2">
                          {item.product?.name}
                        </Link>
                        {item.product?.category?.name && (
                          <p className="text-xs text-gray-400 mt-1">{item.product.category.name}</p>
                        )}
                        <button onClick={() => handleRemove(item.id)} className="flex items-center gap-1 text-xs text-red-brand hover:underline mt-2">
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                    {/* Price */}
                    <div className="col-span-4 sm:col-span-2 text-center">
                      <p className="text-sm font-semibold sm:font-normal">{formatPKR(item.product?.price)}</p>
                    </div>
                    {/* Qty */}
                    <div className="col-span-4 sm:col-span-2 text-center">
                      <span className="font-semibold">{item.quantity}</span>
                    </div>
                    {/* Total */}
                    <div className="col-span-4 sm:col-span-2 text-right">
                      <p className="font-heading font-bold text-maroon">{formatPKR(item.product?.price * item.quantity)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              <Link to="/products" className="flex items-center gap-2 text-sm text-maroon hover:underline font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-lgray/30 border border-lgray p-6 sticky top-24">
              <h2 className="font-heading font-bold text-lg mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : formatPKR(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Add {formatPKR(99 - subtotal)} more for free shipping</p>
                )}
                <div className="border-t border-lgray pt-3 flex justify-between font-heading font-bold text-lg">
                  <span>Total</span>
                  <span className="text-maroon">{formatPKR(total)}</span>
                </div>
              </div>

              {/* Coupon (UI only) */}
              <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input placeholder="Coupon code" className="input-field pl-8 text-sm py-2" />
                </div>
                <button className="btn-outline text-xs py-2 px-3">Apply</button>
              </div>

              <Link to="/checkout" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                Checkout <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
