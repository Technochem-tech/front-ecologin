
import React from 'react';

interface CarbonCreditsCardProps {
  amount: string;
  unit: string;
}

const CarbonCreditsCard: React.FC<CarbonCreditsCardProps> = ({ amount, unit }) => {
  return (
    <div className="glass-card rounded-2xl p-5 opacity-0 animate-fade-in-delayed-2">
      <h3 className="text-sm font-medium text-eco-blue-800">Créditos de Carbono</h3>
      <div className="mt-1 flex items-end">
        <span className="text-3xl font-semibold text-gray-900">{amount}</span>
        <span className="ml-1 text-gray-600 text-sm mb-1">{unit}</span>
      </div>
      <div className="mt-3 flex items-center">
        <div className="flex-1 bg-gray-100 h-1 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-eco-blue-400 to-eco-green-400 h-full rounded-full" style={{ width: '40%' }}></div>
        </div>
        <span className="ml-2 text-xs text-gray-500">+12.5% este mês</span>
      </div>
    </div>
  );
};

export default CarbonCreditsCard;
