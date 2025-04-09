import React from 'react';

interface InputHeaderProps {
  title: string;
}

export const InputHeader: React.FC<InputHeaderProps> = ({ title }) => {
  return (
    <label className="block text-sm font-medium text-gray-700">{title}</label>
  );
};
