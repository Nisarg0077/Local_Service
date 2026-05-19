import React, { useState } from "react";
import { Trash2, Plus, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import CategoryModal from "./CategoryModal";

export default function CategoriesTab({ categories, onDelete, onSave }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      console.log();
      onDelete("categories", id);

      toast.success("Category deleted successfully");
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    if (onSave) onSave();
  };

  return (
    <div className="animate-fade-in p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Category Management
        </h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm text-left min-w-[400px]">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 capitalize">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold">
                  Category Name
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-8 text-slate-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((c, i) => (
                  <tr
                    key={c._id || `category-${i}`}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-slate-800 dark:text-white">
                      {c.name}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-1.5 md:p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 md:p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSave}
        category={editingCategory}
      />
    </div>
  );
}
