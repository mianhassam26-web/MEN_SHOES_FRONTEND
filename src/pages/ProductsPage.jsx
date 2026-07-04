import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import { fetchProducts } from '../features/products/productsSlice';
import { fetchCategories } from '../features/categories/categoriesSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeletons';
import { Breadcrumb, Pagination, EmptyState } from '../components/common/UI';
import { formatPKR } from '../utils/currency';
import { SearchX } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { list: allProducts, loading } = useSelector((s) => s.products);
  const { list: categories } = useSelector((s) => s.categories);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('');
  const [availability, setAvailability] = useState('all'); // all | instock
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    setLocalSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Filter + Sort
  let filtered = allProducts.filter((p) => {
    const q = localSearch.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchCat = !selectedCategory || String(p.category_id) === String(selectedCategory);
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchAvail = availability === 'all' || (availability === 'instock' && p.stock_quantity > 0);
    return matchSearch && matchCat && matchPrice && matchAvail;
  });

  if (sortBy === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'name_asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setSelectedCategory('');
    setPriceRange([0, 500]);
    setAvailability('all');
    setSortBy('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasFilters = localSearch || selectedCategory || sortBy || availability !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="section-title">Shop All</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} products found</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative hidden sm:block">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="input-field pr-8 pl-3 py-2 text-sm appearance-none cursor-pointer min-w-[180px]"
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm border transition-colors ${filtersOpen ? 'border-maroon bg-maroon text-white' : 'border-lgray hover:border-maroon'}`}
          >
            <SlidersHorizontal size={16} /> Filters
            {hasFilters && <span className="w-5 h-5 bg-red-brand text-white text-xs rounded-full flex items-center justify-center">!</span>}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <motion.aside
          animate={{ width: filtersOpen ? 260 : 0, opacity: filtersOpen ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden flex-shrink-0"
        >
          {filtersOpen && (
            <div className="w-64 space-y-6 pr-4">
              {/* Search */}
              <div>
                <h3 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider">Search</h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    value={localSearch}
                    onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Search products..."
                    className="input-field pr-9 text-sm"
                  />
                  <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </form>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="cat" checked={!selectedCategory} onChange={() => { setSelectedCategory(''); setCurrentPage(1); }} className="accent-maroon" />
                    <span className="text-sm">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="cat" checked={selectedCategory === String(cat.id)} onChange={() => { setSelectedCategory(String(cat.id)); setCurrentPage(1); }} className="accent-maroon" />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h3 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider">
                  Price Range: <span className="text-maroon">{formatPKR(priceRange[0])} - {formatPKR(priceRange[1])}</span>
                </h3>
                <input type="range" min="0" max="500" step="10" value={priceRange[1]}
                  onChange={(e) => { setPriceRange([0, Number(e.target.value)]); setCurrentPage(1); }}
                  className="w-full accent-maroon"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{formatPKR(0)}</span><span>{formatPKR(500)}</span></div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider">Availability</h3>
                <div className="space-y-2">
                  {[['all', 'All Products'], ['instock', 'In Stock Only']].map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="avail" checked={availability === val} onChange={() => { setAvailability(val); setCurrentPage(1); }} className="accent-maroon" />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort mobile */}
              <div className="sm:hidden">
                <h3 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider">Sort By</h3>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field text-sm">
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-2 text-red-brand text-sm font-medium hover:underline">
                  <X size={14} /> Clear All Filters
                </button>
              )}
            </div>
          )}
        </motion.aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {localSearch && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lgray text-sm rounded-full">
                  Search: {localSearch} <button onClick={() => setLocalSearch('')}><X size={12} /></button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lgray text-sm rounded-full">
                  {categories.find((c) => String(c.id) === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('')}><X size={12} /></button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No products found"
              message="Try adjusting your search or filters to find what you're looking for."
              action="/products"
              actionLabel="Clear Filters"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {paginated.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <Pagination current={currentPage} total={totalPages} onChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>
      </div>
    </div>
  );
}
