import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, ChevronDown, LogOut, Package, LayoutDashboard } from 'lucide-react';
import Logo from '../common/Logo';
import { logout } from '../../features/auth/authSlice';
import { toggleCart, fetchCart } from '../../features/cart/cartSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { cart } = useSelector((s) => s.cart);
  const { list: categories } = useSelector((s) => s.categories);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const searchRef = useRef(null);

  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const wishlistCount = useSelector((s) => s.wishlist.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    if (user) dispatch(fetchCart());
    dispatch(fetchCategories());
  }, [user]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
    setUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="nav-link">Home</Link>
              
              {/* Categories mega menu */}
              <div className="relative" onMouseEnter={() => setMegaMenuOpen(true)} onMouseLeave={() => setMegaMenuOpen(false)}>
                <button className="nav-link flex items-center gap-1">
                  Collections <ChevronDown size={14} className={`transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-xl border border-lgray min-w-[280px] p-4 grid grid-cols-2 gap-2"
                    >
                      <Link to="/products" className="col-span-2 text-xs font-button font-semibold text-maroon uppercase tracking-wider mb-1 hover:underline" style={{fontFamily:'Montserrat,sans-serif'}}>
                        All Products →
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${cat.id}`}
                          className="text-sm text-dark hover:text-maroon transition-colors py-1.5 px-2 hover:bg-lgray rounded-sm"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      {categories.length === 0 && (
                        <>
                          {['Shirts', 'T-Shirts', 'Jeans', 'Jackets', 'Shoes', 'Accessories'].map((c) => (
                            <Link key={c} to={`/products?search=${c}`} className="text-sm text-dark hover:text-maroon transition-colors py-1.5 px-2 hover:bg-lgray rounded-sm">{c}</Link>
                          ))}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/products" className="nav-link">Shop</Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-maroon transition-colors">
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="p-2 hover:text-maroon transition-colors relative hidden md:block">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-maroon text-white text-xs rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => { if (!user) { toast.error('Please login first'); navigate('/login'); return; } dispatch(toggleCart()); }}
                className="p-2 hover:text-maroon transition-colors relative"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-brand text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1.5 p-1 hover:text-maroon transition-colors">
                    <div className="w-8 h-8 bg-maroon text-white rounded-full flex items-center justify-center text-sm font-bold font-heading">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white shadow-xl border border-lgray py-2"
                      >
                        <div className="px-4 py-2 border-b border-lgray">
                          <p className="font-semibold text-sm text-dark truncate">{user.full_name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-lgray transition-colors">
                          <User size={15} /> My Dashboard
                        </Link>
                        <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-lgray transition-colors">
                          <Package size={15} /> My Orders
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-maroon font-medium hover:bg-lgray transition-colors">
                            <LayoutDashboard size={15} /> Admin Panel
                          </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-brand hover:bg-lgray transition-colors w-full">
                          <LogOut size={15} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="hidden md:block btn-primary py-2 px-4 text-xs">Login</Link>
              )}

              {/* Mobile menu toggle */}
              <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-lgray bg-white"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-1 input-field text-base"
                />
                <button type="submit" className="btn-primary py-2 px-6">Search</button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-3 hover:text-maroon">
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-lgray"
            >
              <div className="px-4 py-4 space-y-1">
                <Link to="/" className="block py-2.5 text-sm font-medium border-b border-lgray">Home</Link>
                <Link to="/products" className="block py-2.5 text-sm font-medium border-b border-lgray">All Products</Link>
                {categories.map((cat) => (
                  <Link key={cat.id} to={`/products?category=${cat.id}`} className="block py-2 text-sm text-gray-600 pl-3 hover:text-maroon">{cat.name}</Link>
                ))}
                <Link to="/wishlist" className="flex items-center gap-2 py-2.5 text-sm font-medium border-b border-lgray">
                  <Heart size={16} /> Wishlist {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                </Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="block py-2.5 text-sm font-medium border-b border-lgray">Dashboard</Link>
                    <Link to="/orders" className="block py-2.5 text-sm font-medium border-b border-lgray">Orders</Link>
                    {user.role === 'admin' && <Link to="/admin" className="block py-2.5 text-sm font-medium text-maroon border-b border-lgray">Admin Panel</Link>}
                    <button onClick={handleLogout} className="block w-full text-left py-2.5 text-sm font-medium text-red-brand">Logout</button>
                  </>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <Link to="/login" className="btn-primary text-xs py-2 px-4 flex-1 text-center">Login</Link>
                    <Link to="/register" className="btn-outline text-xs py-2 px-4 flex-1 text-center">Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
}
