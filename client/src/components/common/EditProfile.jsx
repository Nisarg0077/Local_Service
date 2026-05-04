import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, providerAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Save, User, Mail, Phone, MapPin, ToggleLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    address: '',
    isAvailable: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [user]);


  const fetchData = async () => {
    if (!user) return;
    try {
      if (user.role === 'customer') {
        const res = await usersAPI.getUser(user.uid || user._id);
        const data = res.data;
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar: data.avatar || '',
          address: data?.address || data?.area || '',
        });
      } else if (user.role === 'provider') {
        const providerId = user.uid || user.providerId || user._id;
        const res = await providerAPI.getProvider(providerId);
        const data = res.data;
        // console.log(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar: data.avatar || '',
          address: data?.address || data?.area || '',
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        });
      }
    } catch (err) {
      toast.error('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'avatar' && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        avatar: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return toast.error('Name is required');
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error('Valid email is required');
    }

    setSaving(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        // Only append avatar if it's an actual File (user selected a new one)
        if (key === 'avatar') {
          if (formData[key] instanceof File) {
            submitData.append(key, formData[key]);
          }
          // Skip string avatar values — the backend keeps the existing one
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (user.role === 'customer') {
        const res = await usersAPI.updateUser(user?.uid, submitData);
        updateUser(res.data.user);
      } else if (user.role === 'provider') {
        const providerId = user?.uid || user.providerId;
        const res = await providerAPI.updateProvider(providerId, submitData);
        updateUser(res.data.provider);
      }
      toast.success('Profile updated successfully');

      // Redirect to respective dashboard after update
      setTimeout(() => {
        if (user.role === 'customer') {
          navigate('/user/dashboard');
        } else if (user.role === 'provider') {
          navigate('/provider/dashboard');
        }
      }, 1500);
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Update your personal details here.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Full Name <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Email Address <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          {/* Avatar Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Profile Avatar
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Address Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="pl-10 w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="123 Main St, City, Country"
              />
            </div>
          </div>
        </div>

        {/* Provider Only: Availability Toggle */}
        {user?.role === 'provider' && (
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-semibold text-slate-800 dark:text-white text-sm">
                Availability Status
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle whether you are currently accepting new bookings.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
