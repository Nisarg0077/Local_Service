import React from 'react';
import { Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProvidersTab({ providers, onDelete }) {
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this provider?")) {
      onDelete('providers', id);
      toast.success("Provider deleted successfully");
    }
  };

  return (
    <div className="animate-fade-in p-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Provider Management</h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 capitalize">
              <tr>
                <th className="px-6 py-4 font-semibold">Provider details</th>
                <th className="px-6 py-4 font-semibold">Business</th>
                <th className="px-6 py-4 font-semibold">Performance</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {providers.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No providers found.</td></tr>
              ) : providers.map(p => (
                <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.avatar ? (
                        <img src={p.avatar.startsWith('http') ? p.avatar : `http://localhost:3000${p.avatar}`} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {p.name?.charAt(0) || 'P'}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-700 dark:text-slate-300">{p?.verifiedBadge ? <CheckCircle className='w-5 h-5 text-green-600 bg-green-100 rounded-full p-0.5' /> : "Not Verified"}</p>
                    {/* <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full">{p.category}</span> */}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-bold text-amber-500">⭐ {p.rating || 0}</span> ({p.reviews || 0} reviews)
                      <div className="text-xs text-slate-500 mt-1">Jobs: {p.completedJobs || 0}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.isAvailable ? "Available" : "Offline"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
