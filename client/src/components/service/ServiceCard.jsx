import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Heart, Zap, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';
import { usersAPI } from '../../services/api';

export default function ServiceCard({ service, provider }) {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const isFavorited = (user?.favorites || []).map(Number).includes(Number(service.id));

  const isRestricted = user?.role === "provider" || user?.role === "admin";
  // console.log(provider);

  // const handleFavorite = (e) => {
  //   e.preventDefault();
  //   if (!isAuthenticated) {
  //     toast.error('Please login to save favorites.');
  //     navigate('/login');
  //     return;
  //   }
  //   const favs = user.favorites || [];
  //   const updated = isFavorited
  //     ? favs.filter(id => id !== service.id)
  //     : [...favs, service.id];
  //   console.log(updated)
  //   usersAPI.updateFav(user?.uid, updated);
  //   updateUser({ favorites: updated });
  //   toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites! ❤️');
  // };



  const handleFavorite = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to save favorites.');
      navigate('/login');
      return;
    }

    // // DEBUG LOGS
    // console.log("ServiceCard: user object:", user);
    // console.log("ServiceCard: user.uid:", user?.uid);

    const favs = user.favorites || [];

    const updated = isFavorited
      ? favs.map(Number).filter(id => id !== Number(service.id))
      : [...favs.map(Number), Number(service.id)];

    // console.log("ServiceCard: updated favorites:", updated);

    try {
      const res = await usersAPI.updateFav(user?.uid, updated);

      updateUser({ favorites: res.data.user.favorites });

      toast.success(
        isFavorited
          ? 'Removed from favorites'
          : 'Added to favorites! ❤️'
      );

    } catch (error) {
      console.error("ServiceCard: error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col border border-slate-100 dark:border-slate-700">

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
        {!imgError && service.image ? (
          <img
            src={service.image.startsWith('http') ? service.image : `http://localhost:3000${service.image}`}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-primary/10 to-secondary/10">
            {service.category === 'Electrician' ? '⚡' :
              service.category === 'Plumber' ? '🔧' :
                service.category === 'Cleaning' ? '🧹' :
                  service.category === 'AC Repair' ? '❄️' :
                    service.category === 'Painting' ? '🎨' :
                      service.category === 'Carpentry' ? '🪵' : '🏠'}
          </div>
        )}

        {/* Favorite btn */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${isFavorited
            ? 'bg-danger text-white scale-110'
            : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-danger hover:scale-110'
            }`}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
        </button>

        {/* Category pill */}
        <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-bold text-primary rounded-full">
          {service.category}
        </span>

        {service.popular && (
          <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-accent/90 text-white text-[10px] font-bold rounded-full">
            <Zap className="w-3 h-3" /> Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-slate-800 dark:text-white text-base mb-1 line-clamp-2 leading-tight">
          {service.title}
        </h3>

        {/* Provider */}
        {provider && (
          <div className="flex items-center gap-2 mb-3">
            <img
              src={provider?.avatar && provider.avatar.startsWith('http') ? provider.avatar : (provider?.avatar ? `http://localhost:3000${provider.avatar}` : "https://i.pravatar.cc/150?u=default")}
              alt={provider?.name || "Provider"}
              onError={(e) => {
                e.target.src = "https://i.pravatar.cc/150?u=default";
              }}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{provider.name}</span>
            {provider.verifiedBadge && (
              <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            )}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{service.rating}</span>
            <span>({service.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{service.duration}</span>
          </div>
          {provider?.area && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{provider.area}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
          {service.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-baseline gap-1">
              {service.priceType === 'starting' && (
                <span className="text-[10px] text-slate-400">Starts at</span>
              )}
              <span className="text-lg font-bold text-slate-800 dark:text-white">
                {formatCurrency(service.price)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {
              isRestricted ? (
                <Link
                  to={`/services/${service.id}`}
                  state={{ service, provider }}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95 whitespace-nowrap"
                >
                  View Details
                </Link>
              ) : (
                <Link
                  to={`/services/${service.id}`}
                  state={{ service, provider, autoBook: true }}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all hover:shadow-glow active:scale-95"
                >
                  Book Now
                </Link>
              )
            }
            {/* <Link
              to={`/services/${service.id}`}
              state={{ service, provider }}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95 whitespace-nowrap"
            >
              View Details
            </Link>
            <Link
              to={`/services/${service.id}`}
              state={{ service, provider, autoBook: true }}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all hover:shadow-glow active:scale-95"
            >
              Book Now
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
