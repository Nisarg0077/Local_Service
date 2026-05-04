import React from 'react';
import {
  Users, UserCheck, FileText, TrendingUp, Activity, AlertTriangle, Download,
  Server, Database, CheckCircle, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';

const COLORS = ['#10B981', '#4F46E5', '#06B6D4', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function OverviewTab({
  stats,
  revenueChartData,
  categoryChartData,
  recentActivityLog,
  onTabChange
}) {
  const [chartPeriod, setChartPeriod] = React.useState('monthly');

  const statCards = [
    { label: 'Total Users', value: stats.users?.toLocaleString('en-IN') || 0, icon: Users, color: 'text-primary', bg: 'bg-primary/10', change: '+12%', up: true },
    { label: 'Providers', value: stats.providers?.toLocaleString('en-IN') || 0, icon: UserCheck, color: 'text-secondary', bg: 'bg-secondary/10', change: '+8%', up: true },
    { label: 'Total Bookings', value: stats.bookings?.toLocaleString('en-IN') || 0, icon: FileText, color: 'text-success', bg: 'bg-green-50 dark:bg-green-900/20', change: '+24%', up: true },
    { label: 'Revenue', value: formatCurrency(stats.revenue || 0), icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', change: '+18%', up: true },
    { label: 'Active Services', value: stats.services || 0, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', change: '+5%', up: true },
    { label: 'Pending Reviews', value: stats.reviews || 0, icon: AlertTriangle, color: 'text-danger', bg: 'bg-red-50 dark:bg-red-900/20', change: '', up: false },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Platform Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time metrics and system health</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex p-2 rounded-xl mb-3 ${s.bg}`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-heading font-bold text-slate-800 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
              {s.change && (
                <div className={`text-[10px] font-bold mt-1 ${s.up ? 'text-green-500' : 'text-red-500'}`}>{s.up ? '↑' : '↓'} {s.change}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => onTabChange('users')}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-white text-sm">Manage Users</p>
              <p className="text-[10px] text-slate-500">View & edit accounts</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        </button>

        <button 
          onClick={() => onTabChange('providers')}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-white text-sm">Manage Providers</p>
              <p className="text-[10px] text-slate-500">Review & verify</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        </button>

        <button 
          onClick={() => onTabChange('services')}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-success" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-white text-sm">Manage Services</p>
              <p className="text-[10px] text-slate-500">Service categories & pricing</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        </button>

        <button 
          onClick={() => onTabChange('reviews')}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/50 dark:bg-amber-900/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-white text-sm">Review Approvals</p>
              <p className="text-[10px] text-slate-500">Approve user feedback</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 dark:text-white">Revenue Over Time</h2>
            <div className="flex gap-2">
              {['monthly', 'quarterly'].map(p => (
                <button key={p} onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${chartPeriod === p ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                  {p === 'monthly' ? 'Monthly' : 'Quarterly'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-60 text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} formatter={v => [formatCurrency(v), 'Revenue']} />
                <Bar dataKey="revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-6">Bookings by Category</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {categoryChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {categoryChartData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color || COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-400">{c.name}</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-800 dark:text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700">
            {recentActivityLog.slice(0, 4).map(log => (
              <div key={log.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${log.type === 'user' ? 'bg-indigo-100 text-indigo-600' :
                  log.type === 'alert' ? 'bg-red-100 text-red-600' :
                    log.type === 'payment' ? 'bg-green-100 text-green-600' :
                      'bg-slate-100 text-slate-500'
                  }`}>
                  {log.type === 'user' ? '👤' : log.type === 'alert' ? '⚠️' : log.type === 'payment' ? '💳' : log.type === 'provider' ? '🔧' : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{log.action}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{log.user}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <p className="flex items-center gap-2 text-sm font-bold mb-1 text-amber-800 dark:text-amber-400">
              <span>⚠️</span> Pending Approvals
            </p>
            <p className="text-xs text-amber-800/80 dark:text-amber-400/80">You have {stats.reviews} review applications awaiting review.</p>
          </div>
          <div className="p-4 rounded-2xl border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <p className="flex items-center gap-2 text-sm font-bold mb-1 text-green-800 dark:text-green-400">
              <span>✅</span> System Status
            </p>
            <p className="text-xs text-green-800/80 dark:text-green-400/80">All services are fully operational and databases are backed up automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
