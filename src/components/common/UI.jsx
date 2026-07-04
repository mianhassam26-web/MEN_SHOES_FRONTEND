import { motion } from 'framer-motion';
import { AlertCircle, PackageX, SearchX, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

// Scroll to top button
export function BackToTop() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <motion.button
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-maroon text-white rounded-full flex items-center justify-center shadow-lg hover:bg-maroon-light transition-colors"
    >
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M8 12V4M4 8l4-4 4 4" />
      </svg>
    </motion.button>
  );
}

// Empty state
export function EmptyState({ icon: Icon = PackageX, title, message, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-20 h-20 bg-lgray rounded-full flex items-center justify-center mb-5">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="font-heading font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-6">{message}</p>
      {action && (
        <Link to={action} className="btn-primary">{actionLabel || 'Go Back'}</Link>
      )}
    </div>
  );
}

// Error state
export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle size={40} className="text-red-brand mb-4" />
      <p className="font-heading font-semibold mb-2">Error</p>
      <p className="text-gray-500 text-sm mb-4">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-outline text-sm">Try Again</button>}
    </div>
  );
}

// Loader spinner
export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div className={`${s} border-2 border-lgray border-t-maroon rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

// Breadcrumb
export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {item.href ? (
            <Link to={item.href} className="hover:text-maroon transition-colors">{item.label}</Link>
          ) : (
            <span className="text-dark font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Pagination
export function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
        className="w-9 h-9 border border-lgray flex items-center justify-center text-sm hover:border-maroon hover:text-maroon transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ‹
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`w-9 h-9 border text-sm transition-colors ${
            current === page
              ? 'border-maroon bg-maroon text-white'
              : 'border-lgray hover:border-maroon hover:text-maroon'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
        className="w-9 h-9 border border-lgray flex items-center justify-center text-sm hover:border-maroon hover:text-maroon transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
}

// Rating stars
export function Rating({ value = 4, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < value ? '#207A20' : 'none'} stroke={i < value ? '#207A20' : '#ccc'} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// Modal
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const maxW = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-lg';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`relative bg-white w-full ${maxW} shadow-2xl p-6`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-bold text-xl">{title}</h3>
          <button onClick={onClose} className="p-1 hover:text-maroon transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
