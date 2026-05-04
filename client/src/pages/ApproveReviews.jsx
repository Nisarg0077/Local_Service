import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { usersAPI } from "../services/api";

export default function ApproveReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // ✅ Get unique userIds from reviews
        const userIds = [...new Set(reviews.map((r) => r.userId))];

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
          }),
        );

        setUsersMap(map);
      } catch (err) {
        console.error(err);
      }
    };

    if (reviews.length) fetchUsers();
  }, [reviews]);

  const fetchPendingReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reviews/pending");
      setReviews(res.data);
    } catch (error) {
      toast.error("Failed to fetch pending reviews");
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id) => {
    try {
      await api.put(`/reviews/approve/${id}`);
      toast.success("Review approved!");
      fetchPendingReviews();
    } catch (error) {
      toast.error("Failed to approve review");
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate("/admin/dashboard/reviews")}
          className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:text-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-2xl p-8">
          <h2 className="text-3xl font-heading font-bold mb-8 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">
            Approve Reviews
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 capitalize">
                  <tr>
                    <th className="px-6 py-4 font-semibold">UserID</th>
                    <th className="px-6 py-4 font-semibold">User Name</th>
                    <th className="px-6 py-4 font-semibold">Rating</th>
                    <th className="px-6 py-4 font-semibold lg:w-1/2">
                      Comment
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {reviews.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-10 text-slate-500"
                      >
                        No pending reviews found.
                      </td>
                    </tr>
                  ) : (
                    reviews.map((r) => {
                      const userData = usersMap[r.userId];
                      return (
                        <tr
                          key={r._id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-4">{r.userId}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                                {userData?.avatar ? (
                                  <img
                                    src={userData?.avatar}
                                    className="w-full h-full object-fill"
                                    alt={userData?.name}
                                  />
                                ) : (
                                  "U"
                                )}
                              </div>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {userData?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-amber-500 font-bold whitespace-nowrap">
                            {"⭐".repeat(Math.round(r.rating || 0))}{" "}
                            <span className="text-slate-500 font-normal ml-1">
                              ({r.rating})
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-600 dark:text-slate-300 line-clamp-2 md:line-clamp-none">
                              {r.comment}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                onClick={() => approveReview(r._id)}
                                className="flex items-center gap-1 px-4 py-2 text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-lg transition-colors font-medium"
                              >
                                <CheckCircle className="w-4 h-4" /> Approve
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
