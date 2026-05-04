import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Star, Server, Calendar, User, ChevronRight } from 'lucide-react';
import Badge from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils';
import { Link } from 'react-router-dom';

export default function OverviewTab({
  user,
  isAvailable,
  provider,
  statCards,
  providerEarningsData,
  myBookings,
  allServices,
  onTabChange,
}) {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">
          Provider Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {isAvailable ? '🟢 You are currently accepting bookings.' : '🔴 You are currently offline.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card">
              <div className={`inline-flex p-2 rounded-xl mb-3 ${s.bg}`}>
                {Icon ? <Icon className={`w-5 h-5 ${s.color}`} /> : <div className="w-5 h-5" />}
              </div>
              <div className="text-2xl font-heading font-bold text-slate-800 dark:text-white mb-1">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button 
          onClick={() => onTabChange('services')}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-white text-sm">Manage Services</p>
              <p className="text-xs text-slate-500">Update your offerings</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        </button>

        <button 
          onClick={() => onTabChange('bookings')}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-white text-sm">View Bookings</p>
              <p className="text-xs text-slate-500">Check your schedule</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        </button>

        <button 
          onClick={() => onTabChange('profile')}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <User className="w-5 h-5 text-success" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-white text-sm">Edit Profile</p>
              <p className="text-xs text-slate-500">Update your details</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Provider Rating */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Weekly Earnings</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerEarningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={v => `₹${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={v => [formatCurrency(v), 'Earnings']}
                />
                <Bar dataKey="earnings" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-5">Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">Rating</span>
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />{provider?.rating || '0'}/5
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${((provider?.rating || 0) / 5) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">Completion Rate</span>
                <span className="font-bold text-success">95%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                <div className="h-full bg-success rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">On-Time Rate</span>
                <span className="font-bold text-primary">88%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-bold text-slate-800 dark:text-white">
            Upcoming Jobs
          </h2>
        </div>

        <div className="divide-y divide-slate-50 dark:divide-slate-700">

          {myBookings?.filter(b => b.status === "Pending" || b.status === "Confirmed")
            .slice(0, 5)
            .map(b => {

              const svc = allServices?.find(
                s => String(s.id) === String(b.serviceId) || String(s._id) === String(b.serviceId)
              );

              return (
                <div
                  key={b._id || b.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                    {svc?.category?.toLowerCase()?.includes("electric")
                      ? "⚡"
                      : svc?.category?.toLowerCase()?.includes("plumb")
                        ? "🔧"
                        : "🏠"}
                  </div>

                  {/* Service Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                      {svc?.title || 'Unknown Service'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(b.date)} at {b.time}
                    </p>
                  </div>

                  {/* Price + Status */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">
                      {formatCurrency(b.amount || svc?.price || 0)}
                    </span>
                    <Badge status={b.status} />
                  </div>
                </div>
              );
            })}

          {/* Empty State */}
          {(!myBookings || myBookings.filter(b => b.status === "Pending" || b.status === "Confirmed").length === 0) && (
            <div className="py-10 text-center text-slate-500">
              No upcoming bookings
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
