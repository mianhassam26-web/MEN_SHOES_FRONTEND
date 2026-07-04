import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Check, ChevronLeft, ZoomIn, Package, Shield, Truck } from 'lucide-react';
import { fetchProductById, fetchProducts, clearSelected } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { ProductDetailSkeleton } from '../components/common/Skeletons';
import { Breadcrumb, Rating, ErrorState } from '../components/common/UI';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';
import { formatPKR } from '../utils/currency';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: product, loading, error, list } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const wishlist = useSelector((s) => s.wishlist.items);
  const isWishlisted = wishlist.some((i) => i.id === product?.id);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    dispatch(fetchProductById(id));
    if (list.length === 0) dispatch(fetchProducts());
    return () => dispatch(clearSelected());
  }, [id]);

  const imgUrl = product?.image_url ? `${BASE_URL}${product.image_url}` : null;
  const inStock = product?.stock_quantity > 0;
  const related = list.filter((p) => p.id !== product?.id && p.category_id === product?.category_id).slice(0, 4);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (!inStock) return;
    setAdding(true);
    try {
      await dispatch(addToCart({ product_id: product.id, quantity })).unwrap();
      toast.success('Added to cart!');
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      toast.error(err || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12"><ProductDetailSkeleton /></div>;
  if (error || !product) return <div className="max-w-7xl mx-auto px-4 py-12"><ErrorState message="Product not found" onRetry={() => dispatch(fetchProductById(id))} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: product.name }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="space-y-3">
          <div className="relative group bg-lgray aspect-square overflow-hidden cursor-zoom-in" onClick={() => setLightbox(true)}>
            {imgUrl ? (
              <motion.img
                src={imgUrl} alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={64} className="text-gray-200" />
              </div>
            )}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow">
                <ZoomIn size={16} />
              </div>
            </div>
            {!inStock && (
              <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
                <span className="font-heading font-bold text-white text-xl tracking-wider">OUT OF STOCK</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {/* Category */}
          {product.category?.name && (
            <p className="text-maroon text-xs font-button font-semibold tracking-[0.2em] uppercase mb-3" style={{fontFamily:'Montserrat,sans-serif'}}>
              {product.category.name}
            </p>
          )}

          <h1 className="font-heading font-bold text-3xl md:text-4xl text-dark leading-tight mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <Rating value={4} />
            <span className="text-sm text-gray-500">(24 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-heading font-bold text-3xl text-dark">{formatPKR(product.price)}</span>
          </div>

          {/* Stock status */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium mb-6 ${inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-brand'}`}>
            <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-brand'}`} />
            {inStock ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
          </div>

          {/* Description snippet */}
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6 border-l-2 border-maroon pl-4">
              {product.description.substring(0, 150)}{product.description.length > 150 ? '...' : ''}
            </p>
          )}

          {/* Quantity */}
          {inStock && (
            <div className="mb-6">
              <label className="text-xs font-button font-semibold tracking-widest uppercase text-gray-500 block mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>Quantity</label>
              <div className="inline-flex border border-lgray">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-11 flex items-center justify-center hover:bg-lgray transition-colors text-lg font-light">−</button>
                <span className="w-12 h-11 flex items-center justify-center font-semibold text-sm border-x border-lgray">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="w-10 h-11 flex items-center justify-center hover:bg-lgray transition-colors text-lg font-light">+</button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className={`flex-1 py-4 font-button font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                added ? 'bg-green-600 text-white' : 'btn-primary'
              } disabled:bg-gray-300 disabled:cursor-not-allowed`}
              style={{fontFamily:'Montserrat,sans-serif'}}
            >
              {adding ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : added ? <Check size={16} /> : <ShoppingBag size={16} />}
              {!inStock ? 'Out of Stock' : adding ? 'Adding...' : added ? 'Added!' : 'Add to Cart'}
            </button>
            <button
              onClick={() => { dispatch(toggleWishlist(product)); toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!'); }}
              className={`w-14 h-14 border-2 flex items-center justify-center transition-colors ${isWishlisted ? 'border-red-brand bg-red-brand text-white' : 'border-lgray hover:border-red-brand hover:text-red-brand'}`}
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {inStock && (
            <button onClick={handleBuyNow} className="w-full btn-outline py-4 mb-8">
              Buy Now
            </button>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-lgray pt-6">
            {[
              { icon: Truck, label: 'Free Shipping', sub: `Orders ${formatPKR(99)}+` },
              { icon: Shield, label: 'Secure Pay', sub: 'Encrypted' },
              { icon: Package, label: 'Easy Return', sub: '30 days' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center gap-1.5">
                <b.icon size={18} className="text-maroon" />
                <p className="text-xs font-semibold text-dark">{b.label}</p>
                <p className="text-xs text-gray-400">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-lgray">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-button font-semibold tracking-wider uppercase transition-colors -mb-px ${
                activeTab === tab ? 'border-b-2 border-maroon text-maroon' : 'text-gray-500 hover:text-dark'
              }`}
              style={{fontFamily:'Montserrat,sans-serif'}}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="max-w-2xl">
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="max-w-md">
              <table className="w-full text-sm">
                <tbody>
                  {[['Product ID', `#${product.id}`], ['Category', product.category?.name || 'N/A'], ['Price', formatPKR(product.price)], ['Stock', `${product.stock_quantity} units`], ['Availability', inStock ? 'In Stock' : 'Out of Stock']].map(([key, val]) => (
                    <tr key={key} className="border-b border-lgray">
                      <td className="py-3 pr-6 font-semibold text-dark w-36">{key}</td>
                      <td className="py-3 text-gray-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-6 p-4 bg-lgray/50">
                <div className="text-center">
                  <p className="font-heading font-bold text-4xl text-maroon">4.0</p>
                  <Rating value={4} />
                  <p className="text-xs text-gray-500 mt-1">Based on 24 reviews</p>
                </div>
              </div>
              {testimonialRows.map((r, i) => (
                <div key={i} className="py-4 border-b border-lgray last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-maroon text-white rounded-full flex items-center justify-center text-xs font-bold">{r.name[0]}</div>
                    <div>
                      <p className="font-semibold text-sm">{r.name}</p>
                      <Rating value={r.rating} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm ml-11">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="font-heading font-bold text-2xl mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && imgUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={imgUrl} alt={product.name} className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const testimonialRows = [
  { name: 'Ali M.', rating: 5, text: 'Excellent quality, very satisfied with the purchase.' },
  { name: 'Sara K.', rating: 4, text: 'Great product, fast delivery. Highly recommend!' },
  { name: 'Omar T.', rating: 4, text: 'Good material and stitching. Will buy again.' },
];
