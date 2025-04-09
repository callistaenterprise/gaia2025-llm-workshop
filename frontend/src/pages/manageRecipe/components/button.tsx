import React from 'react';

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, disabled, ...rest }) => {
  const styling = `px-4 py-2 ${disabled?'bg-blue-200':'bg-blue-500'} text-white rounded hover:bg-blue-700 whitespace-nowrap w-auto`;
  return (
    <button
      type="button"
      onClick={onClick}
      className={styling}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
