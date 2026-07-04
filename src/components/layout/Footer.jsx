import { Link } from 'react-router-dom';
import { Globe, Share2, MessageCircle, Play, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-20">
      {/* Newsletter */}
      <div className="bg-maroon py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">Join the Inner Circle</h3>
          <p className="text-white/70 text-sm mb-6">Exclusive drops, style edits, and early access — straight to your inbox.</p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 text-dark text-sm focus:outline-none" />
            <button type="submit" className="bg-white text-maroon font-button font-semibold px-6 py-3 text-sm tracking-wider uppercase hover:bg-lgray transition-colors" style={{fontFamily:'Montserrat,sans-serif'}}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="mb-4">
            <Logo variant="light" />
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Premium men's fashion crafted for the modern gentleman. Quality that speaks, style that endures.
          </p>
          <div className="flex gap-3">
            {[Globe, Share2, MessageCircle, Play].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-sm flex items-center justify-center hover:bg-maroon transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-heading font-semibold text-sm tracking-widest uppercase text-beige mb-5">Collections</h4>
          <ul className="space-y-2.5">
            {['New Arrivals', 'Best Sellers', 'Shirts', 'T-Shirts', 'Jeans', 'Jackets', 'Accessories'].map((item) => (
              <li key={item}>
                <Link to="/products" className="text-white/60 text-sm hover:text-white transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-semibold text-sm tracking-widest uppercase text-beige mb-5">Account</h4>
          <ul className="space-y-2.5">
            {[['My Profile', '/dashboard'], ['My Orders', '/orders'], ['Wishlist', '/wishlist'], ['Shopping Cart', '/cart'], ['Login', '/login'], ['Register', '/register']].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-white/60 text-sm hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-semibold text-sm tracking-widest uppercase text-beige mb-5">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-white/60 text-sm">
              <MapPin size={16} className="flex-shrink-0 mt-0.5 text-beige" />
              <span>123 Fashion Street,<br />Lahore, Pakistan</span>
            </li>
            <li className="flex items-center gap-3 text-white/60 text-sm">
              <Phone size={16} className="text-beige" />
              <span>+92 300 000 0000</span>
            </li>
            <li className="flex items-center gap-3 text-white/60 text-sm">
              <Mail size={16} className="text-beige" />
              <span>hello@menshoes.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} Men Shoes. All rights reserved.</p>
          <div className="flex gap-4 text-white/40 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
