import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, MapPin, CreditCard, Package } from 'lucide-react';
import { placeOrder } from '../features/orders/ordersSlice';
import { fetchCart, clearCart } from '../features/cart/cartSlice';
import { Breadcrumb } from '../components/common/UI';
import toast from 'react-hot-toast';
import { formatPKR } from '../utils/currency';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const steps = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: Package },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.orders);

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({ name: user?.full_name || '', email: user?.email || '', phone: '', address: '', city: '', zip: '' });
  const [payment, setPayment] = useState('cod');
  const [placed, setPlaced] = useState(false);

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const shippingCost = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchCart());
  }, []);

  useEffect(() => {
    if (items.length === 0 && !placed) navigate('/cart');
  }, [items]);

  const handleShippingNext = (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.address || !shipping.city) {
      toast.error('Please fill all required fields'); return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    const res = await dispatch(placeOrder());
    if (!res.error) {
      setPlaced(true);
      dispatch(clearCart());
      setStep(4);
    } else {
      toast.error(res.payload || 'Order failed. Please try again.');
    }
  };

  if (placed && step === 4) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check size={36} className="text-white" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-heading font-bold text-3xl mb-3">Order Placed!</h1>
          <p className="text-gray-500 mb-2">Thank you, <strong>{user?.full_name}</strong>!</p>
          <p className="text-gray-500 text-sm mb-8">Your order has been successfully placed and is being processed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/orders')} className="btn-primary px-8 py-3">View My Orders</button>
            <button onClick={() => navigate('/products')} className="btn-outline px-8 py-3">Continue Shopping</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-10">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-button font-semibold transition-all ${step >= s.id ? 'bg-maroon text-white' : 'bg-lgray text-gray-400'}`} style={{fontFamily:'Montserrat,sans-serif'}}>
              <s.icon size={15} />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-px w-8 sm:w-16 mx-1 transition-colors ${step > s.id ? 'bg-maroon' : 'bg-lgray'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Step 1 — Shipping */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-white border border-lgray p-6">
                  <h2 className="font-heading font-bold text-lg mb-5 flex items-center gap-2"><MapPin size={18} className="text-maroon" /> Shipping Address</h2>
                  <form onSubmit={handleShippingNext} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-xs">Full Name *</label>
                        <input value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} className="input-field mt-1" placeholder="Ali Ahmed" required />
                      </div>
                      <div>
                        <label className="label-xs">Email</label>
                        <input value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} type="email" className="input-field mt-1" placeholder="ali@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="label-xs">Phone Number</label>
                      <input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="input-field mt-1" placeholder="+92 300 0000000" />
                    </div>
                    <div>
                      <label className="label-xs">Street Address *</label>
                      <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className="input-field mt-1" placeholder="House # Street, Area" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-xs">City *</label>
                        <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="input-field mt-1" placeholder="Lahore" required />
                      </div>
                      <div>
                        <label className="label-xs">ZIP Code</label>
                        <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className="input-field mt-1" placeholder="54000" />
                      </div>
                    </div>
                    <div className="pt-2">
                      <button type="submit" className="btn-primary w-full py-3.5">Continue to Payment →</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-white border border-lgray p-6">
                  <h2 className="font-heading font-bold text-lg mb-5 flex items-center gap-2"><CreditCard size={18} className="text-maroon" /> Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                      { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, EasyPaisa', icon: '💳' },
                      { id: 'bank', label: 'Bank Transfer', desc: 'Direct bank transfer', icon: '🏦' },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-start gap-4 p-4 border-2 cursor-pointer transition-colors ${payment === opt.id ? 'border-maroon bg-maroon/5' : 'border-lgray hover:border-gray-300'}`}>
                        <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="mt-1 accent-maroon" />
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">{opt.icon}</span>
                          <div>
                            <p className="font-semibold text-sm">{opt.label}</p>
                            <p className="text-xs text-gray-500">{opt.desc}</p>
                          </div>
                        </div>
                        {payment === opt.id && <Check size={16} className="text-maroon flex-shrink-0 mt-0.5" />}
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-6">
                    <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">← Back</button>
                    <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3">Review Order →</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Review */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-white border border-lgray p-6">
                  <h2 className="font-heading font-bold text-lg mb-5 flex items-center gap-2"><Package size={18} className="text-maroon" /> Review Your Order</h2>

                  {/* Shipping summary */}
                  <div className="mb-5 p-4 bg-lgray/40 space-y-1">
                    <p className="text-xs font-button font-semibold tracking-widest uppercase text-gray-500 mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>Shipping To</p>
                    <p className="text-sm font-semibold">{shipping.name}</p>
                    <p className="text-sm text-gray-600">{shipping.address}, {shipping.city} {shipping.zip}</p>
                    {shipping.phone && <p className="text-sm text-gray-600">{shipping.phone}</p>}
                  </div>

                  {/* Payment summary */}
                  <div className="mb-5 p-4 bg-lgray/40">
                    <p className="text-xs font-button font-semibold tracking-widest uppercase text-gray-500 mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>Payment</p>
                    <p className="text-sm font-semibold capitalize">{payment === 'cod' ? 'Cash on Delivery' : payment === 'card' ? 'Credit/Debit Card' : 'Bank Transfer'}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {items.map((item) => {
                      const img = item.product?.image_url ? `${BASE_URL}${item.product.image_url}` : null;
                      return (
                        <div key={item.id} className="flex gap-3 items-center">
                          <div className="w-14 h-16 bg-lgray flex-shrink-0 overflow-hidden">
                            {img ? <img src={img} alt={item.product?.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={16} className="text-gray-300" /></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{item.product?.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-maroon flex-shrink-0">{formatPKR(item.product?.price * item.quantity)}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-lgray">
                    <button onClick={() => setStep(2)} className="btn-outline flex-1 py-3">← Back</button>
                    <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                      {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                      {loading ? 'Placing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        <div>
          <div className="bg-lgray/30 border border-lgray p-5 sticky top-24">
            <h3 className="font-heading font-bold text-base mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600 truncate pr-2">{item.product?.name} ×{item.quantity}</span>
                  <span className="flex-shrink-0 font-medium">{formatPKR(item.product?.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-lgray pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPKR(subtotal)}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>{shippingCost === 0 ? 'FREE' : formatPKR(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-heading font-bold text-base pt-2 border-t border-lgray">
                <span>Total</span><span className="text-maroon">{formatPKR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
