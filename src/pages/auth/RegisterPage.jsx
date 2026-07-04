import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Check } from 'lucide-react';
import { registerUser, loginUser, clearError } from '../../features/auth/authSlice';
import Logo from '../../components/common/Logo';
import toast from 'react-hot-toast';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const getPasswordStrength = (pass) => {
  if (!pass) return 0;
  let score = 0;
  if (pass.length >= 6) score++;
  if (pass.length >= 10) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const strengthColor = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [showPass, setShowPass] = useState(false);
  const [passValue, setPassValue] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const passwordWatch = watch('password', '');
  const strength = getPasswordStrength(passwordWatch);

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user]);

  const onSubmit = async (data) => {
    const regRes = await dispatch(registerUser({ full_name: data.full_name, email: data.email, password: data.password }));
    if (!regRes.error) {
      const loginRes = await dispatch(loginUser({ email: data.email, password: data.password }));
      if (!loginRes.error) { toast.success('Account created successfully!'); navigate('/'); }
    } else {
      toast.error(regRes.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-lgray/20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center">
            <Logo size="lg" />
          </Link>
          <h1 className="font-heading font-bold text-2xl mt-6 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm">Join Men Shoes and shop the finest collection</p>
        </div>

        <div className="bg-white shadow-sm border border-lgray p-8">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-brand text-sm p-3 mb-5"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-xs font-button font-semibold tracking-widest uppercase text-gray-600 block mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('full_name')} type="text" placeholder="Ali Ahmed"
                  className={`input-field pl-10 ${errors.full_name ? 'border-red-brand' : ''}`}
                />
              </div>
              {errors.full_name && <p className="text-red-brand text-xs mt-1">{errors.full_name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-button font-semibold tracking-widest uppercase text-gray-600 block mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('email')} type="email" placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-brand' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-brand text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-button font-semibold tracking-widest uppercase text-gray-600 block mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-brand' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordWatch && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColor[strength] : 'bg-lgray'}`} />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${strength >= 3 ? 'text-green-600' : 'text-orange-500'}`}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-brand text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-button font-semibold tracking-widest uppercase text-gray-600 block mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('confirmPassword')} type={showPass ? 'text' : 'password'} placeholder="Repeat password"
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-brand' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-brand text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-lgray text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-maroon font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
