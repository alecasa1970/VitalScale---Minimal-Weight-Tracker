
import React from 'react';
import { WeightEntry } from '../types';
import { Trash2, Calendar, Scale } from 'lucide-react';

interface WeightListProps {
  weights: WeightEntry[];
  onDelete: (id: string) => void;
}

const WeightList: React.FC<WeightListProps> = ({ weights, onDelete }) => {
  if (weights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Scale size={48} className="mb-4 opacity-20" />
        <p className="font-medium">Nenhum registro ainda.</p>
        <p className="text-xs">Comece a sua jornada hoje!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-4">
      <h2 className="text-slate-900 font-bold text-lg mb-4">Histórico de Pesagem</h2>
      {weights.map((entry, index) => {
        const date = new Date(entry.date);
        const diff = index < weights.length - 1 ? entry.weight - weights[index + 1].weight : null;

        return (
          <div 
            key={entry.id} 
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <Calendar size={18} className="text-slate-400" />
              </div>
              <div>
                <div className="text-slate-900 font-bold text-base">{entry.weight.toFixed(1)} kg</div>
                <div className="text-slate-400 text-xs font-medium">
                  {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {diff !== null && (
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  diff < 0 ? 'bg-green-50 text-green-600' : diff > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                </div>
              )}
              <button 
                onClick={() => onDelete(entry.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeightList;
