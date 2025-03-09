import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

export const MaterialIcon: React.FC<IconProps> = ({ name, className = '' }) => {
  return (
    <span className={`material-icons ${className}`}>
      {name}
    </span>
  );
};

export default MaterialIcon;
