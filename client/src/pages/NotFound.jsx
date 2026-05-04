import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-6 text-center">
      <div className="text-8xl mb-6">🧭</div>
      <h1 className="text-6xl font-heading font-black text-slate-800 dark:text-white mb-3">404</h1>
      <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-3">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>← Go Back</Button>
        <Link to="/"><Button variant="outline">Go Home</Button></Link>
        <Link to="/services"><Button>Browse Services</Button></Link>
      </div>
    </div>
  );
}
