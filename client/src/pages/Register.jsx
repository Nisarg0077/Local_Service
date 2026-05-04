import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Zap, ArrowLeft, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import axios from 'axios';

const ROLES = [
  { value: 'customer', label: 'Customer', desc: 'Book services', icon: '🛒' },
  { value: 'provider', label: 'Service Provider', desc: 'Offer services', icon: '🔧' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'customer', avatar: null });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState("");

  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim() || form.name.length < 2) errs.name = 'Please enter your full name';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Min. 8 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };


  const generateUID = async (role) => {
    try {

      const res = await fetch("http://localhost:3000/api/userroutes/users");
      const users = await res.json();

      let prefix = "c";
      if (role === "provider") prefix = "p";
      if (role === "admin") prefix = "a";

      const roleUsers = users.filter(u => u.role === role);

      let maxNumber = 0;

      roleUsers.forEach(user => {
        if (user.uid) {
          const num = parseInt(user.uid.slice(1));
          if (num > maxNumber) maxNumber = num;
        }
      });

      const nextNumber = maxNumber + 1;

      return prefix + String(nextNumber).padStart(3, "0");

    } catch (error) {
      console.error("UID generation failed", error);
      return null;
    }
  };

  const handleChange = (field) => (e) => {
    const { value, files } = e.target;
    if (field === 'avatar' && files && files[0]) {
      setForm(f => ({ ...f, avatar: files[0] }));
    } else {
      setForm(f => ({ ...f, [field]: value }));
    }
    if (errors[field]) setErrors(err => ({ ...err, [field]: '' }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);

    try {

      const uid = await generateUID(form.role);

      const userData = {
        ...form,
        uid
      };

      // Since we are doing a real backend call with FormData, 
      // we'll prepare the FormData here.
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key] !== null) {
          formData.append(key, userData[key]);
        }
      });

      const res = await fetch("http://localhost:3000/api/userroutes/register", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!data.reg) {
        toast.error(data.message || "Registration failed");
        return;
      }

      // Automatically log in after registration
      // We need to fetch the user again or get it from the registration response if it returned the user/token
      // For now, let's just use the current mock login approach or navigate to login
      
      // Since our register context function also sets the user, we should probably call it 
      // with the response data if it contains the user/token.
      // But the backend /register only returns { message, reg: true }.
      // So we should probably navigate to login or update register context to be better.
      
      toast.success(`Account created! Please log in to continue. 🎉`);
      navigate("/login");

    } catch (error) {

      setServerError("Server error. Try again later.");
      toast.error(error.message || "Registration failed");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/30 p-8 border border-slate-100 dark:border-slate-700">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join SmartLocal today — it's free!</p>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${s <= step ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  I want to... <span className="text-danger">*</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, role: r.value }))}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${form.role === r.value
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'}`}
                    >
                      <span className="text-2xl">{r.icon}</span>
                      <div className="text-center">
                        <p className={`text-sm font-bold ${form.role === r.value ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{r.label}</p>
                        <p className="text-xs text-slate-500">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>



              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input id="reg-name" label="Full Name" type="text" placeholder="John Doe"
                  value={form.name} onChange={handleChange('name')} error={errors.name}
                  required leftIcon={<User className="w-4 h-4" />} />

                <Input id="reg-email" label="Email Address" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange('email')} error={errors.email}
                  required leftIcon={<Mail className="w-4 h-4" />} />

                <Input id="reg-phone" label="Mobile Number (optional)" type="tel" placeholder="9876543210"
                  value={form.phone} onChange={handleChange('phone')} error={errors.phone}
                  leftIcon={<Phone className="w-4 h-4" />} hint="Used for booking reminders" />

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Profile Avatar (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange('avatar')}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>


                <Input id="reg-password" label="Create Password" type="password" placeholder="Min. 8 characters"
                  value={form.password} onChange={handleChange('password')} error={errors.password}
                  required showStrength leftIcon={<Lock className="w-4 h-4" />} />

                <Input id="reg-confirm" label="Confirm Password" type="password" placeholder="Repeat password"
                  value={form.confirm} onChange={handleChange('confirm')} error={errors.confirm}
                  required leftIcon={<Lock className="w-4 h-4" />} />

                {/* <Button type="button" fullWidth size="lg" onClick={handleNext}>
                Continue →
                </Button> */}

                <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                  Create Account
                </Button>
              </form>
            </div>
          ) : (

            <div>
              <h1>are you sure?</h1>
            </div>
            // <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            //   <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl mb-2">
            //     <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
            //       {form.name[0]?.toUpperCase()}
            //     </div>
            //     <div>
            //       <p className="text-sm font-bold text-slate-800 dark:text-white">{form.name}</p>
            //       <p className="text-xs text-slate-500">{form.email}</p>
            //     </div>
            //     <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-primary hover:underline">Edit</button>
            //   </div>

            //   {/* <Input id="reg-password" label="Create Password" type="password" placeholder="Min. 8 characters"
            //     value={form.password} onChange={handleChange('password')} error={errors.password}
            //     required showStrength leftIcon={<Lock className="w-4 h-4" />} />

            //   <Input id="reg-confirm" label="Confirm Password" type="password" placeholder="Repeat password"
            //     value={form.confirm} onChange={handleChange('confirm')} error={errors.confirm}
            //     required leftIcon={<Lock className="w-4 h-4" />} /> */}

            //   <p className="text-xs text-slate-500 dark:text-slate-400">
            //     By creating an account, you agree to our{' '}
            //     <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> &{' '}
            //     <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            //   </p>

            //   <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            //     Create Account
            //   </Button>
            // </form>
          )}

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
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
