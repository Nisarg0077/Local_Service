import React from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersTab({ users, onDelete }) {
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      onDelete('users', id);
      toast.success("User deleted successfully");
    }
  };

  return (
    <div className="animate-fade-in p-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">User Management</h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 capitalize">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email Account</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No users found.</td></tr>
              ) : users
                .filter(u => u.role === 'customer')  // ✅ Hide admins
                .map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'provider' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                        {u.role || 'customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(u._id)}
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
