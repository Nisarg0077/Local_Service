import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

// const DEMO_CREDS = [
//   { label: 'Customer', email: 'rahul@demo.com', password: 'Demo@123' },
//   { label: 'Provider', email: 'aryan@demo.com', password: 'Demo@123' },
//   { label: 'Admin', email: 'admin@demo.com', password: 'Admin@123' },
// ];


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const errs = validate();
  //   if (Object.keys(errs).length > 0) { setErrors(errs); return; }
  //   setIsLoading(true);
  //   try {
  //     const user = await login(form.email, form.password);
  //     console.log(user)
  //     const res = await fetch("http://localhost:3000/api/userroutes/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ email: form.email, password: form.password })
  //     });

  //     const data = await res.json();
  //     console.log(data);
  //     if (!data.log) {
  //       toast.error(data.message || 'Login failed');
  //       return;
  //     } else {

  //       toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`);
  //       const dashMap = { customer: '/user/dashboard', provider: '/provider/dashboard' };

  //       navigate(dashMap[data.user.role] || '/', { replace: true });
  //       // navigate("/user/dashboard");
  //     }
  //   } catch (err) {
  //     toast.error(err.message || 'Login failed');
  //     setErrors({ password: 'Invalid email or password' });
  //     console.log(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleDemoLogin = async (cred) => {
  //   setIsLoading(true);
  //   try {
  //     const user = await login(cred.email, cred.password);
  //     toast.success(`Logged in as ${cred.label} 🎉`);
  //     const dashMap = { customer: '/user/dashboard', provider: '/provider/dashboard', admin: '/admin/dashboard' };
  //     navigate(dashMap[user.role] || '/', { replace: true });
  //   } catch {
  //     toast.error('Demo login failed');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };





  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);

    try {

      const user = await login(form.email, form.password);

      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);

      const dashMap = {
        customer: "/user/dashboard",
        provider: "/provider/dashboard"
      };

      navigate(dashMap[user.role] || "/", { replace: true });

    } catch (err) {
      toast.error(err.message || "Login failed");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(err => ({ ...err, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* background blob */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative z-10">

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/30 p-8 border border-slate-100 dark:border-slate-700">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Welcome Back!</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your SmartLocal account</p>
          </div>

          {/* Demo Login Buttons */}
          {/* <div className="mb-6">
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-3 font-medium">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDS.map((cred) => (
                <button
                  key={cred.label}
                  type="button"
                  onClick={() => handleDemoLogin(cred)}
                  disabled={isLoading}
                  className="py-2 px-1 text-xs font-semibold border-2 border-dashed border-primary/30 dark:border-primary/40 text-primary rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50"
                >
                  {cred.label}
                </button>
              ))}
            </div>
          </div> */}

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400">or login with email</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="flex justify-end">
              <Link to="#" className="text-xs text-primary font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Register Free
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
