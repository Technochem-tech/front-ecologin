
import React from 'react';

interface BalanceCardProps {
  amount: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ amount }) => {
  return (
    <div className="glass-card rounded-2xl p-5 opacity-0 animate-fade-in-delayed">
      <h3 className="text-sm font-medium text-eco-green-800">Saldo Disponível</h3>
      <div className="mt-1 flex items-end">
        <span className="text-3xl font-semibold text-gray-900"> {amount}</span>
      </div>
      <div className="mt-3 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
        <div className="bg-gradient-to-r from-eco-green-400 to-eco-blue-400 h-full rounded-full" style={{ width: '65%' }}></div>
      </div>
    </div>
  );
};

export default BalanceCard;
