import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'green' | 'red' | 'orange' | 'gray';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant, children, className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all duration-300 transform active:scale-95 flex items-center justify-center text-center min-h-[50px]";
  
  const variants = {
    green: "bg-green-500 hover:bg-green-600 shadow-green-500/30",
    red: "bg-red-500 hover:bg-red-600 shadow-red-500/30",
    orange: "bg-orange-400 hover:bg-orange-500 shadow-orange-400/30",
    gray: "bg-gray-400 cursor-not-allowed opacity-50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};