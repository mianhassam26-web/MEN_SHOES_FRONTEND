import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import { Breadcrumb, EmptyState } from '../components/common/UI';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatPKR } from '../utils/currency';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.wishlist);
  const { user } = useSelector((s) => s.auth);

  const handleAddToCart = async (product) => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (product.stock_quantity < 1) { toast.error('Out of stock'); return; }
    try {
      await dispatch(addToCart({ product_id: product.id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err || 'Failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">My Wishlist</h1>
        <span className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Save items you love by clicking the heart icon on any product."
          action="/products"
          actionLabel="Discover Products"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {items.map((product) => {
              const imgUrl = product.image_url ? `${BASE_URL}${product.image_url}` : null;
              const inStock = product.stock_quantity > 0;
              return (
                <motion.div
                  key={product.id} layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-white border border-lgray hover:border-maroon/30 hover:shadow-md transition-all relative"
                >
                  {/* Remove */}
                  <button
                    onClick={() => { dispatch(removeFromWishlist(product.id)); toast.success('Removed from wishlist'); }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:text-red-brand transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>

                  <Link to={`/products/${product.id}`}>
                    <div className="aspect-[3/4] bg-lgray overflow-hidden">
                      {imgUrl ? (
                        <img src={imgUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={32} className="text-gray-200" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-3">
                    <Link to={`/products/${product.id}`} className="font-heading font-semibold text-sm line-clamp-2 hover:text-maroon transition-colors block">
                      {product.name}
                    </Link>
                    <p className="font-heading font-bold text-maroon mt-1">{formatPKR(product.price)}</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!inStock}
                      className="mt-3 w-full btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={13} />
                      {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
