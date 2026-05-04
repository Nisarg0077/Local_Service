import React from 'react';

const variants = {
  primary: 'bg-primary hover:bg-indigo-700 text-white shadow-sm hover:shadow-md active:scale-95',
  secondary: 'bg-secondary hover:bg-cyan-600 text-white shadow-sm hover:shadow-md active:scale-95',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-95',
  ghost: 'text-primary hover:bg-primary/10 active:scale-95',
  danger: 'bg-danger hover:bg-red-600 text-white shadow-sm hover:shadow-md active:scale-95',
  success: 'bg-success hover:bg-emerald-600 text-white shadow-sm hover:shadow-md active:scale-95',
  dark: 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm active:scale-95',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
  xl: 'px-10 py-4 text-lg rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50
        disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
