import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { closeCart, removeFromCart, addToCart } from '../../features/cart/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatPKR } from '../../utils/currency';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isOpen } = useSelector((s) => s.cart);

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId)).then((res) => {
      if (res.error) toast.error('Failed to remove item');
      else toast.success('Item removed');
    });
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-lgray">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-maroon" />
                <h2 className="font-heading font-bold text-lg">Your Cart</h2>
                <span className="badge">{items.length}</span>
              </div>
              <button onClick={() => dispatch(closeCart())} className="p-2 hover:text-maroon transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag size={48} className="text-lgray mb-4" />
                  <h3 className="font-heading font-semibold text-lg mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm mb-6">Add items to get started</p>
                  <Link to="/products" onClick={() => dispatch(closeCart())} className="btn-primary">
                    Browse Products
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const imgUrl = item.product?.image_url
                    ? `${BASE_URL}${item.product.image_url}`
                    : null;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3 p-3 bg-lgray/30 rounded-sm"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 bg-lgray flex-shrink-0 overflow-hidden">
                        {imgUrl ? (
                          <img src={imgUrl} alt={item.product?.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-lgray flex items-center justify-center">
                            <ShoppingBag size={24} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-sm leading-tight truncate">{item.product?.name}</h4>
                        <p className="text-maroon font-button font-bold text-sm mt-1" style={{fontFamily:'Montserrat,sans-serif'}}>
                          {formatPKR(item.product?.price * item.quantity)}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">{formatPKR(item.product?.price)} each</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      {/* Remove */}
                      <button onClick={() => handleRemove(item.id)} className="self-start p-1.5 text-gray-400 hover:text-red-brand transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-lgray px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="font-heading font-bold text-lg">{formatPKR(total)}</span>
                </div>
                <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
                <button onClick={handleCheckout} className="btn-primary w-full py-4 text-center block">
                  Proceed to Checkout
                </button>
                <Link to="/cart" onClick={() => dispatch(closeCart())} className="btn-outline w-full py-3 text-center block text-sm">
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
