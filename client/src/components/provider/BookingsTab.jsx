import React from "react";
import { CheckCircle, Clock } from "lucide-react";
import { formatDate, formatCurrency } from "../../utils";

export default function BookingsTab({ bookings, onUpdateStatus }) {
  const handleStatusChange = (e, id) => {
    const newStatus = e.target.value;
    if (onUpdateStatus) {
      onUpdateStatus(id, newStatus);
    }
  };

  return (
    <div className="animate-fade-in p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-slate-800 dark:text-white">
            Customer Bookings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage and update the status of your bookings
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 capitalize">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">
                    No bookings found for your services.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-white">
                        {b.customerId || "Guest Customer"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-white">
                        {b.serviceId || "Unknown Service"}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono tracking-wider">
                        {b._id?.slice(-8)}
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
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full flex items-center w-max gap-1 ${
                          b.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : b.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {b.status === "Accepted" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {b.status === "Completed" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {b.status === "Pending" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {b.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <select
                          value={b.status || "Pending"}
                          onChange={(e) => handleStatusChange(e, b._id)}
                          className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
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
