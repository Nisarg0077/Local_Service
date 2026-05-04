import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from 'lucide-react';
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function EditService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [service, setService] = useState({
    title: "",
    category: "",
    price: "",
    priceType: "",
    includes: "",
    image: "",
    duration: "",
    description: ""
  });

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const res = await api.get(`/services/${serviceId}`);
      setService(res.data);
    } catch (error) {
      toast.error("Failed to load service data");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setService({ ...service, image: files[0] });
    } else {
      setService({ ...service, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service.title || !service.category || !service.price) {
      toast.error("Please fill in required fields (Name, Category, Price)");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(service).forEach(key => {
        if (key === 'includes' && Array.isArray(service[key])) {
          service[key].forEach(item => formData.append("includes[]", item));
        } else if (key === 'image') {
          // Only send image if user selected a new file
          if (service[key] instanceof File) {
            formData.append(key, service[key]);
          }
          // Skip string image values — the backend keeps the existing one
        } else if (key === '_id' || key === '__v') {
          // Skip MongoDB internal fields
        } else {
          formData.append(key, service[key]);
        }
      });

      await api.put(`/services/${serviceId}`, formData);
      toast.success("Service updated successfully!");
      navigate(user?.role === 'provider' ? "/provider/dashboard/services" : "/admin/dashboard/services");
    } catch (error) {
      toast.error("Failed to update service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
     return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(user?.role === 'provider' ? "/provider/dashboard/services" : "/admin/dashboard/services")}
          className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:text-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-2xl p-8">
          <h2 className="text-3xl font-heading font-bold mb-8 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">
            Update Service
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Service Name *</label>
              <input
                name="title"
                value={service.title || ""}
                onChange={handleChange}
                placeholder="e.g. AC Repair"
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Category *</label>
              <input
                name="category"
                value={service.category || ""}
                onChange={handleChange}
                placeholder="e.g. Electrician"
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Price (₹) *</label>
              <input
                name="price"
                type="number"
                value={service.price || ""}
                onChange={handleChange}
                placeholder="e.g. 500"
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Price Type</label>
              <select
                name="priceType"
                value={service.priceType || ""}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              >
                <option value="">Select Price Type</option>
                <option value="fixed">Fixed</option>
                <option value="starting">Starting From</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Duration</label>
              <input
                name="duration"
                value={service.duration || ""}
                onChange={handleChange}
                placeholder="Example: 2 Hours"
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Includes (Comma separated)</label>
              <input
                name="includes"
                value={service.includes || ""}
                onChange={handleChange}
                placeholder="e.g. Filter cleaning, Gas check"
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Service Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
              {typeof service.image === 'string' && service.image && (
                <p className="mt-2 text-xs text-slate-500 italic">Current image: {service.image}</p>
              )}
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Description</label>
              <textarea
                name="description"
                value={service.description || ""}
                onChange={handleChange}
                rows="4"
                placeholder="Detailed description of the service..."
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition shadow ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Update Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}