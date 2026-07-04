import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ErrorPage({ code, title, message, showHome = true }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="font-heading font-bold text-[8rem] md:text-[12rem] leading-none text-lgray select-none">
          {code}
        </div>
        <div className="-mt-8 relative">
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-dark mb-3">{title}</h1>
          <p className="text-gray-500 text-base max-w-md mx-auto mb-8">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showHome && <Link to="/" className="btn-primary px-8 py-3">Go to Home</Link>}
            <button onClick={() => window.history.back()} className="btn-outline px-8 py-3">Go Back</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
    />
  );
}

export function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      title="Access Denied"
      message="You don't have permission to view this page. Please login with the right account."
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorPage
      code="500"
      title="Server Error"
      message="Something went wrong on our end. Please try again in a moment."
    />
  );
}
