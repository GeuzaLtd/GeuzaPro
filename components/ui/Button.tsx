import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-full transition-all duration-300 inline-flex items-center justify-center';

  const variants = {
    primary: 'bg-[#0F9E59] text-white hover:bg-[#0d8a4d]',
    secondary: 'bg-[#FF7900] text-white hover:bg-[#e66d00]',
    outline: 'border-2 border-[#0F9E59] text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
