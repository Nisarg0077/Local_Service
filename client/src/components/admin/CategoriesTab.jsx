import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoriesTab({ categories, onDelete }) {
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      onDelete('categories', id);
      toast.success("Category deleted successfully");
    }
  };

  return (
    <div className="animate-fade-in p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Category Management</h1>
        <button
          onClick={() => {
            // Placeholder for future Add Category functionality
            toast('Add Category form would open here', { icon: 'ℹ️' });
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden md:w-2/3 lg:w-1/2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 capitalize">
              <tr>
                <th className="px-6 py-4 font-semibold">Category Name</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {categories.length === 0 ? (
                <tr><td colSpan="2" className="text-center py-8 text-slate-500">No categories found.</td></tr>
              ) : categories.map(c => (
                <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                    {c.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(c._id)}
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
