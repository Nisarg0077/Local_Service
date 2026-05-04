import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { getPasswordStrength } from '../../utils';

export default function Input({
  label,
  type = 'text',
  error,
  hint,
  required,
  className = '',
  showStrength = false,
  leftIcon,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const strength = showStrength && isPassword ? getPasswordStrength(props.value || '') : null;

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={inputType}
          {...props}
          className={`
            w-full pl-4 ${isPassword ? 'pr-11' : 'pr-4'} py-2.5
            border rounded-xl text-sm transition-all duration-200 outline-none
            bg-white dark:bg-slate-800
            text-slate-800 dark:text-white
            placeholder:text-slate-400
            ${error
              ? 'border-danger focus:ring-2 focus:ring-danger/30'
              : 'border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Password strength bar */}
      {strength && props.value && (
        <div className="mt-2 space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`}
              />
            ))}
          </div>
          {strength.label && (
            <p className={`text-xs font-medium ${strength.color?.replace('bg-', 'text-')}`}>
              Password: {strength.label}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
