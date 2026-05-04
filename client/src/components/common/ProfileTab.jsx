import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Star,
  CheckCircle, DollarSign, Edit, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { providerAPI } from '../../services/api';
import { formatDate, formatCurrency } from '../../utils';
import EditProfile from './EditProfile';

export default function ProfileTab() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [extraData, setExtraData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'provider') {
      fetchProviderData();
    }
  }, [user]);

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      // Use the specific provider lookup if it's a provider
      const id = user?.uid || user?.providerId || user?._id;
      const res = await providerAPI.getProvider(id);
      setExtraData(res.data);
    } catch (err) {
      console.error("Failed to fetch provider data", err);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="text-sm text-primary font-bold hover:underline flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 transition-all"
          >
            &larr; Back to Profile
          </button>
        </div>
        <EditProfile />
      </div>
    );
  }

  // Merge context user data with extra provider data if available
  const profileData = user?.role === 'provider' ? { ...user, ...extraData } : user;

  const InfoRow = ({ icon: Icon, label, value, color = "text-slate-500" }) => (
    <div className="flex items-center gap-4 py-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-700/20 px-2 rounded-xl">
      <div className={`w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-700 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{value || "Not provided"}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Header/Cover Section */}
        <div className="h-40 bg-gradient-to-br from-primary to-indigo-700 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 flex items-center gap-2 px-5 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-800 dark:text-white rounded-2xl text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all border border-white/20"
          >
            <Edit className="w-4 h-4 text-primary" /> Edit Profile
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-8 pb-10">
          {/* Avatar and Identity */}
          <div className="relative -mt-16 mb-8 flex flex-col items-center md:items-start md:flex-row md:gap-8">
            <div className="relative group">
              {profileData?.avatar
                ? <img
                  src={profileData.avatar.startsWith('http') ? profileData.avatar : `http://localhost:3000${profileData.avatar}`}
                  alt={profileData.name}
                  className="w-36 h-36 rounded-[2rem] object-cover ring-8 ring-white dark:ring-slate-800 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                : <div className="w-36 h-36 rounded-[2rem] bg-primary text-white text-5xl font-bold flex items-center justify-center ring-8 ring-white dark:ring-slate-800 shadow-2xl">
                  {user?.name?.charAt(0)}
                </div>
              }
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800">
                <CheckCircle className="w-5 h-5 text-success fill-success/10" />
              </div>
            </div>

            <div className="mt-6 md:mt-20 text-center md:text-left">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3 justify-center md:justify-start">
                {profileData?.name}
                {user?.role === 'provider' && profileData?.verifiedBadge && (
                  <ShieldCheck className="w-7 h-7 text-primary fill-primary/10" />
                )}
              </h1>
              <p className="text-slate-500 font-medium text-lg mt-1">{profileData?.email}</p>

              <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                <span className={`px-4 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-sm ${user?.role === 'provider' ? 'bg-indigo-600 text-white' : 'bg-primary text-white'}`}>
                  {user?.role}
                </span>
                {user?.role === 'provider' && (
                  <span className={`px-4 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2 border shadow-sm ${profileData?.isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    <div className={`w-2 h-2 rounded-full ${profileData?.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                    {profileData?.isAvailable ? 'Available' : 'Offline'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
            {/* Column 1: Core Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-.5 h-6 bg-primary rounded-full" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">General Information</h3>
              </div>
              <InfoRow icon={Mail} label="Official Email" value={profileData?.email} color="text-blue-500" />
              <InfoRow icon={Phone} label="Contact Number" value={profileData?.phone} color="text-indigo-500" />
              <InfoRow icon={MapPin} label="Service Area / Address" value={profileData?.address || profileData?.area} color="text-danger" />
              <InfoRow icon={Calendar} label="Member Since" value={formatDate(profileData?.joinedAt)} color="text-success" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
