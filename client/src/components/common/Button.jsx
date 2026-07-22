import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  variant = 'primary', // primary, secondary, ghost, pill
  to,
  onClick,
  children,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-dfi-body font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-dfi-coral focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-dfi-coral text-white hover:bg-[#EA580C] hover:-translate-y-1 hover:shadow-lg shadow-dfi-coral/30 px-6 py-3.5 rounded-[20px]',
    secondary: 'bg-white text-dfi-coral border-2 border-dfi-coral hover:bg-dfi-coral/5 hover:-translate-y-1 px-6 py-3.5 rounded-[20px] shadow-sm hover:shadow-lg',
    ghost: 'bg-transparent text-dfi-dark hover:text-dfi-coral px-4 py-2 rounded-[20px]',
    pill: 'bg-dfi-coral text-white hover:bg-[#EA580C] px-6 py-2.5 rounded-full text-sm hover:shadow-md'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon size={18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {content}
    </button>
  );
};

export default Button;
