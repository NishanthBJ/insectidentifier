import React from 'react';
import { InsectData } from '../types';

interface InsectCardProps {
  data: InsectData;
}

const InsectCard: React.FC<InsectCardProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('extinct')) return 'bg-red-500 border-red-400';
    if (lowerStatus.includes('vulnerable') || lowerStatus.includes('endangered')) return 'bg-yellow-500 border-yellow-400';
    return 'bg-green-500 border-green-400';
  };

  return (
    <div className="bg-gray-900/50 border border-white/10 rounded-xl shadow-xl overflow-hidden w-full max-w-2xl animate-fade-in transition-all duration-300 hover:shadow-emerald-500/20 hover:-translate-y-1 hover:border-white/20">
      <div className="relative">
        <img className="w-full h-72 object-cover" src={data.imageUrl} alt={`Image of ${data.name}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className={`absolute top-4 right-4 px-3 py-1 text-white text-sm font-bold rounded-full border ${getStatusColor(data.status)}`}>
          {data.status}
        </div>
         <div className="absolute bottom-0 left-0 p-6">
            <h2 className="text-4xl font-bold text-white leading-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{data.name}</h2>
            <p className="text-lg italic text-gray-300" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>{data.scientificName}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-300 text-base leading-relaxed">
          {data.description}
        </p>
      </div>
    </div>
  );
};

export default InsectCard;