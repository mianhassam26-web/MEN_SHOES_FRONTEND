import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { addToCart, fetchCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatPKR } from '../../utils/currency';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const wishlist = useSelector((s) => s.wishlist.items);
  const isWishlisted = wishlist.some((i) => i.id === product.id);
  const [adding, setAdding] = useState(false);

  const imgUrl = product.image_url ? `${BASE_URL}${product.image_url}` : null;
  const inStock = product.stock_quantity > 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); navigate('/login'); return; }
    if (!inStock) return;
    setAdding(true);
    try {
      await dispatch(addToCart({ product_id: product.id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-lgray aspect-[3/4]">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <ShoppingBag size={36} />
              <span className="text-xs mt-2">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {!inStock && <span className="badge bg-gray-500">Out of Stock</span>}
            {inStock && product.stock_quantity <= 5 && (
              <span className="badge bg-orange-500">Only {product.stock_quantity} left</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
                isWishlisted ? 'bg-red-brand text-white' : 'bg-white text-dark hover:bg-red-brand hover:text-white'
              }`}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to={`/products/${product.id}`} className="w-9 h-9 rounded-full bg-white text-dark hover:bg-maroon hover:text-white flex items-center justify-center shadow-md transition-colors">
                <Eye size={16} />
              </Link>
            </motion.div>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className="w-full py-3 bg-maroon text-white text-xs font-button font-semibold tracking-wider uppercase hover:bg-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{fontFamily:'Montserrat,sans-serif'}}
            >
              {adding ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag size={14} />
              )}
              {!inStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-3 pb-2">
          {product.category?.name && (
            <p className="text-xs text-maroon font-button font-semibold tracking-wider uppercase mb-1" style={{fontFamily:'Montserrat,sans-serif'}}>
              {product.category.name}
            </p>
          )}
          <h3 className="font-heading font-semibold text-dark text-sm leading-tight line-clamp-2 group-hover:text-maroon transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="font-heading font-bold text-dark text-base">{formatPKR(product.price)}</span>
            <span className="text-xs text-gray-400">{inStock ? `${product.stock_quantity} in stock` : 'Out of stock'}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
