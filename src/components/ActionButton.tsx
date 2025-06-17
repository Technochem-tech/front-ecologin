
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: 'green' | 'blue';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  color = 'green'
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl flex flex-col items-center justify-center p-4 w-full transition-all
        bg-white/80 backdrop-blur-sm border border-white/30 shadow-sm
        hover:shadow-md hover:border-white/50 active:shadow-sm active:scale-[0.98]
        ${color === 'green' ? 'hover:bg-eco-green-50/80' : 'hover:bg-eco-blue-50/80'}`}
    >
      <div className={`rounded-full p-2.5 mb-2 
        ${color === 'green' 
          ? 'bg-eco-green-100 text-eco-green-600' 
          : 'bg-eco-blue-100 text-eco-blue-600'}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </button>
  );
};

export default ActionButton;
