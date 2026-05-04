import React from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate, formatCurrency } from "../../utils";

export default function BookingsTab({ bookings, onDelete }) {
  // console.log(bookings);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      onDelete("bookings", id);
      toast.success("Booking deleted successfully");
    }
  };

  return (
    <div className="animate-fade-in p-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Booking Management
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 capitalize">
              <tr>
                <th className="px-6 py-4 font-semibold">Booking ID</th>
                <th className="px-6 py-4 font-semibold">Service Details</th>
                <th className="px-6 py-4 font-semibold">Schedule</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {bookings.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No bookings found.</td></tr>
              ) : bookings.map(b => (
                <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">{b.bookingId}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 dark:text-white">{b.serviceId || 'Unknown Service'}</p>
                    <p className="text-xs text-slate-500 mt-1">Provider: {b.providerId || 'TBD'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{b.date ? formatDate(b.date) : 'N/A'}</p>
                    <p className="text-xs text-slate-500">{b.time || 'Flexible'}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{b.amount ? formatCurrency(b.amount) : '₹0'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${b.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      b.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        b.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>
                      {b.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                      {b.bookingId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-white">
                        {b.serviceId || "Unknown Service"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Provider: {b.providerId || "TBD"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {b.date ? formatDate(b.date) : "N/A"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {b.time || "Flexible"}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {b.amount ? formatCurrency(b.amount) : "₹0"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${
                          b.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : b.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {b.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
