import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Shield, Truck, RefreshCw, CreditCard, ArrowRight } from 'lucide-react';
import { fetchProducts } from '../features/products/productsSlice';
import { fetchCategories } from '../features/categories/categoriesSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeletons';
import { formatPKR } from '../utils/currency';

const categoryIcons = {
  Shirts: '👔', 'T-Shirts': '👕', Jeans: '👖', Shoes: '👟', Jackets: '🧥', Accessories: '⌚',
};

const features = [
  { icon: Truck, title: 'Free Shipping', desc: `On all orders above ${formatPKR(99)}` },
  { icon: Shield, title: 'Premium Quality', desc: 'Handpicked materials only' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'Encrypted & safe checkout' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
];

const testimonials = [
  { name: 'Ahmed K.', rating: 5, text: 'Absolutely love the quality. The shirts are perfectly tailored and the fabric is luxurious.' },
  { name: 'Usman T.', rating: 5, text: 'Fast delivery, premium packaging. Men Shoes has become my go-to for work attire.' },
  { name: 'Bilal R.', rating: 4, text: 'Great collection, excellent value for money. The jackets are especially impressive.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

export default function HomePage() {
  const dispatch = useDispatch();
  const { list: products, loading } = useSelector((s) => s.products);
  const { list: categories } = useSelector((s) => s.categories);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  const bestSellers = products.slice(0, 8);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] bg-dark flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-maroon/40" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-gradient-to-l from-beige to-transparent" />
        </div>

        {/* Decorative lines */}
        <div className="absolute left-[55%] top-0 bottom-0 w-px bg-white/5" />
        <div className="absolute right-[20%] top-0 bottom-0 w-px bg-white/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-10 bg-beige" />
              <span className="text-beige text-xs font-button tracking-[0.3em] uppercase" style={{fontFamily:'Montserrat,sans-serif'}}>
                New Collection 2025
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-white text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-6"
            >
              Dress Like<br />
              <span className="text-beige">You Mean</span><br />
              Business
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/60 text-lg leading-relaxed mb-10 max-w-md"
            >
              Premium men's fashion curated for the modern gentleman. 
              Quality that commands respect.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products" className="btn-primary py-4 px-8 text-sm">
                Shop Collection
              </Link>
              <Link to="/products" className="flex items-center gap-2 text-white/80 font-button text-sm font-semibold tracking-wider uppercase hover:text-white transition-colors group" style={{fontFamily:'Montserrat,sans-serif'}}>
                Explore All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-8 mt-16 pt-8 border-t border-white/10"
            >
              {[['2000+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                <div key={label}>
                  <p className="font-heading font-bold text-white text-2xl">{val}</p>
                  <p className="text-white/50 text-xs tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-maroon text-xs font-button tracking-[0.3em] uppercase mb-3" style={{fontFamily:'Montserrat,sans-serif'}}>Browse By Category</p>
          <h2 className="section-title">Find Your Style</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(categories.length > 0 ? categories : [
            {id:0,name:'Shirts'},{id:1,name:'T-Shirts'},{id:2,name:'Jeans'},{id:3,name:'Jackets'},{id:4,name:'Shoes'},{id:5,name:'Accessories'}
          ]).map((cat, i) => (
            <motion.div
              key={cat.id}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.05}
            >
              <Link
                to={categories.length > 0 ? `/products?category=${cat.id}` : `/products?search=${cat.name}`}
                className="group flex flex-col items-center gap-3 p-5 border border-lgray hover:border-maroon transition-all duration-300 hover:shadow-lg text-center"
              >
                <span className="text-3xl">{categoryIcons[cat.name] || '👗'}</span>
                <span className="text-sm font-heading font-semibold text-dark group-hover:text-maroon transition-colors">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-20 bg-lgray/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-maroon text-xs font-button tracking-[0.3em] uppercase mb-3" style={{fontFamily:'Montserrat,sans-serif'}}>Top Picks</p>
              <h2 className="section-title">Best Sellers</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-maroon font-button text-sm font-semibold tracking-wider uppercase hover:gap-3 transition-all" style={{fontFamily:'Montserrat,sans-serif'}}>
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : bestSellers.map((product, i) => (
                <motion.div key={product.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.05}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            }
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              <p>No products available. Backend se connect karein.</p>
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link to="/products" className="btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals Banner ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="bg-maroon relative overflow-hidden p-10 md:p-16 text-white text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20" />
          <div className="relative">
            <p className="text-beige text-xs font-button tracking-[0.3em] uppercase mb-3" style={{fontFamily:'Montserrat,sans-serif'}}>Just Dropped</p>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">New Arrivals</h2>
            <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">Fresh styles added every week. Be the first to wear what's new.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-maroon font-button font-semibold px-8 py-4 text-sm tracking-wider uppercase hover:bg-beige transition-colors" style={{fontFamily:'Montserrat,sans-serif'}}>
              Shop New Arrivals <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 border-t border-b border-lgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 bg-maroon/10 rounded-sm flex items-center justify-center">
                  <f.icon size={22} className="text-maroon" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm">{f.title}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-beige text-xs font-button tracking-[0.3em] uppercase mb-3" style={{fontFamily:'Montserrat,sans-serif'}}>Reviews</p>
            <h2 className="font-heading font-bold text-white text-3xl md:text-4xl">What Our Customers Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                className="bg-white/5 border border-white/10 p-6 hover:border-beige transition-colors"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#D8B79C" stroke="none" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-maroon rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-white/40 text-xs">Verified Customer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
