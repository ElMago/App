import React from 'react';
import logoImg from '../assets/images/logo.png';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => {
  return (
    <img src={logoImg} alt="De la Ribera Racing Logo" className={`${className} object-contain`} />
  );
};
