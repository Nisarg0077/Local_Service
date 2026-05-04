import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from 'lucide-react';
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function AddService() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setService({ ...service, image: files[0] });
    } else {
      setService({ ...service, [name]: value });
    }
  };

  const generateServiceId = async () => {
    try {
      const res = await api.get("/services");
      const services = res.data;

      let maxId = 0;

      services.forEach(service => {
        const id = Number(service.id);
        if (id > maxId) maxId = id;
      });

      return maxId + 1;

    } catch (error) {
      console.error("ID generation failed", error);
      return Date.now(); // fallback unique number
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!service.title || !service.category || !service.price) {
  //     toast.error("Please fill in required fields (Name, Category, Price)");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await api.post("/services/add", { ...service, providerId: user?.uid });
  //     toast.success("Service added successfully!");
  //     navigate(user?.role === 'provider' ? "/provider/dashboard/services" : "/admin/dashboard/services");
  //   } catch (error) {
  //     toast.error("Failed to add service. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!service.title || !service.category || !service.price) {
      toast.error("Please fill in required fields (Name, Category, Price)");
      return;
    }

    setLoading(true);

    try {
      const id = await generateServiceId();

      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", service.title);
      formData.append("category", service.category);
      formData.append("price", Number(service.price));
      formData.append("priceType", service.priceType === 'start' ? 'starting' : service.priceType);
      formData.append("duration", service.duration);
      formData.append("description", service.description);
      formData.append("providerId", user?.uid || "");
      
      const includesArray = service.includes ? service.includes.split(',').map(item => item.trim()) : [];
      includesArray.forEach(item => formData.append("includes[]", item));
      
      if (service.image) {
        formData.append("image", service.image);
      }

      await api.post("/services/add", formData);

      toast.success("Service added successfully!");

      navigate(
        user?.role === "provider"
          ? "/provider/dashboard/services"
          : "/admin/dashboard/services"
      );

    } catch (error) {
      toast.error("Failed to add service. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(user?.role === 'provider' ? "/provider/dashboard/services" : "/admin/dashboard/services")}
          className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:text-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-2xl p-8">
          <h2 className="text-3xl font-heading font-bold mb-8 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">
            Add New Service
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Service Name *</label>
              <input
                name="title"
                placeholder="e.g. AC Repair"
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Category *</label>
              <input
                name="category"
                placeholder="e.g. Electrician"
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Price (₹) *</label>
              <input
                name="price"
                type="number"
                placeholder="e.g. 500"
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Price Type</label>
              <select
                name="priceType"
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
                placeholder="Example: 2 Hours"
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Includes (Comma separated)</label>
              <input
                name="includes"
                placeholder="e.g. Filter cleaning, Gas check"
                onChange={handleChange}
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
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Description</label>
              <textarea
                name="description"
                placeholder="Detailed description of the service..."
                onChange={handleChange}
                rows="4"
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
                {loading ? 'Saving...' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}