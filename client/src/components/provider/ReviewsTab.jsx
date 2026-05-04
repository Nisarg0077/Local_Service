import React from 'react';

export default function ReviewsTab({ reviews }) {
  return (
    <div className="animate-fade-in p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customer Reviews</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">See what customers are saying about your work</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm text-left">

            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 capitalize">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold lg:w-1/2">Comment</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {reviews.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No reviews found yet.</td></tr>
              ) : reviews.map(r => (
                <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 font-bold">
                        {r.userName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white">{r.userName}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 dark:text-white">{r.serviceId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-amber-500 font-bold whitespace-nowrap">
                    {'⭐'.repeat(Math.round(r.rating || 0))} <span className="text-slate-500 font-normal ml-1">({r.rating})</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 dark:text-slate-300 line-clamp-2 md:line-clamp-none">{r.comment}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
