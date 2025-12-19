import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  as?: 'button' | 'span';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  as = 'button',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-transparent text-white bg-brand-orange hover:bg-orange-700",
    secondary: "border-transparent text-white bg-brand-black hover:bg-gray-800",
    outline: "border-brand-orange text-brand-orange bg-transparent hover:bg-brand-orange hover:text-white"
  };

  const width = fullWidth ? 'w-full' : '';
  const combinedClassName = `${baseStyles} ${variants[variant]} ${width} ${className}`;

  if (as === 'span') {
    return (
      <span className={combinedClassName}>
        {children}
      </span>
    );
  }

  return (
    <button 
      className={combinedClassName} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;