// Premium brand logo: gold-bordered monogram crest + "MEN SHOES" wordmark.
// Use `variant="light"` on dark backgrounds (e.g. the footer).

const SIZES = {
  sm: { badge: 32, text: 'text-base', gap: 'gap-2' },
  md: { badge: 40, text: 'text-xl', gap: 'gap-2.5' },
  lg: { badge: 48, text: 'text-2xl', gap: 'gap-3' },
};

export default function Logo({ size = 'md', variant = 'dark', className = '' }) {
  const s = SIZES[size] || SIZES.md;
  const wordColor = variant === 'light' ? 'text-white' : 'text-dark';

  return (
    <div className={`inline-flex items-center ${s.gap} ${className}`}>
      <svg
        width={s.badge}
        height={s.badge}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect x="1" y="1" width="46" height="46" rx="6" fill="#1F5A24" />
        <rect x="4.5" y="4.5" width="39" height="39" rx="4" stroke="#C6A15B" strokeWidth="1" opacity="0.85" />
        <text
          x="24"
          y="31.5"
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="18"
          fontWeight="700"
          fill="#C6A15B"
        >
          MS
        </text>
      </svg>
      <span className={`font-display font-bold tracking-tight leading-none ${s.text} ${wordColor}`}>
        MEN<span className="text-gold font-semibold tracking-widest ml-1">SHOES</span>
      </span>
    </div>
  );
}
