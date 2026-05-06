import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersAPI } from '../../services/api';

export default function ReviewsTab({ reviews, onDelete }) {
  const navigate = useNavigate();
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // ✅ Get unique userIds from reviews
        const userIds = [...new Set(reviews.map(r => r.userId))];

        const map = {};

        await Promise.all(
          userIds.map(async (id) => {
            if (!id) return;

            try {
              const res = await usersAPI.getUser(id);

              const user = res.data;

              // ✅ Match using uid
              if (user.uid === id && user.role === "customer") {
                map[id] = {
                  name: user.name,
                  avatar: user.avatar
                    ? user.avatar.startsWith("http")
                      ? user.avatar
                      : `http://localhost:3000${user.avatar}`
                    : "/default-avatar.png",
                };
              }

            } catch (err) {
              // fallback
              map[id] = {
                name: "Guest User",
                avatar: "/default-avatar.png",
              };
            }
          })
        );

        setUsersMap(map);

      } catch (err) {
        console.error(err);
      }
    };

    if (reviews.length) fetchUsers();

  }, [reviews]);

  // console.log(usersMap);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      onDelete("reviews", id);
      toast.success("Review deleted successfully");
    }
  };

  return (
    <div className="animate-fade-in p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Review Management
        </h1>
        <button
          onClick={() => navigate("/admin/approve-reviews")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <CheckCircle className="w-5 h-5" /> Pending Approvals
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-[700px] text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 capitalize">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold">User</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold">Rating</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold lg:w-1/2">Comment</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold">Date</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {reviews.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No approved reviews found.</td></tr>
              ) : reviews.map(r => {
                const userData = usersMap[r.userId];
                return (
                  <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 font-bold overflow-hidden shrink-0">
                          {userData?.avatar ? <img src={userData?.avatar} className='w-full h-full object-cover' alt={userData?.name} /> : 'U'}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white truncate">{userData?.name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-amber-500 font-bold whitespace-nowrap">
                      {'⭐'.repeat(Math.round(r.rating || 0))} <span className="text-slate-500 font-normal ml-1">({r.rating})</span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2 md:line-clamp-none">{r.comment}</p>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-slate-500 whitespace-nowrap">{r.date || 'N/A'}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="p-1.5 md:p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
