
import React, { useState } from 'react';
import { WeightEntry, AerobicEntry } from '../types';
import { Trash2, Calendar, Scale, Activity, MapPin, Timer } from 'lucide-react';

interface WeightListProps {
  weights: WeightEntry[];
  aerobics: AerobicEntry[];
  onWeightDelete: (id: string) => void;
  onAerobicDelete: (id: string) => void;
}

const WeightList: React.FC<WeightListProps> = ({ weights, aerobics, onWeightDelete, onAerobicDelete }) => {
  const [viewType, setViewType] = useState<'weight' | 'aerobic'>('weight');

  const renderWeights = () => {
    if (weights.length === 0) return <EmptyState label="Nenhum peso registrado." icon={<Scale size={48} />} />;

    return weights.map((entry, index) => {
      const date = new Date(entry.date + 'T00:00:00');
      const diff = index < weights.length - 1 ? entry.weight - weights[index + 1].weight : null;

      return (
        <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group fade-in">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Scale size={18} />
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
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff < 0 ? 'bg-green-50 text-green-600' : diff > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                {diff > 0 ? '+' : ''}{diff.toFixed(1)}
              </div>
            )}
            <button onClick={() => onWeightDelete(entry.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        </div>
      );
    });
  };

  const renderAerobics = () => {
    if (aerobics.length === 0) return <EmptyState label="Nenhuma atividade aeróbica." icon={<Activity size={48} />} />;

    return aerobics.map((entry) => {
      const date = new Date(entry.date + 'T00:00:00');
      return (
        <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group fade-in">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400">
              <Activity size={18} />
            </div>
            <div>
              <div className="text-slate-900 font-bold text-base flex items-center gap-2">
                {entry.duration} min <span className="text-slate-300 text-xs font-normal">|</span> {entry.distance} km
              </div>
              <div className="text-slate-400 text-xs font-medium">
                {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
          <button onClick={() => onAerobicDelete(entry.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
        </div>
      );
    });
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-slate-900 font-bold text-lg">Histórico</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewType('weight')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewType === 'weight' ? 'bg-white text-[#00C896] shadow-sm' : 'text-slate-400'}`}
          >
            Peso
          </button>
          <button 
            onClick={() => setViewType('aerobic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewType === 'aerobic' ? 'bg-white text-orange-400 shadow-sm' : 'text-slate-400'}`}
          >
            Aeróbico
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {viewType === 'weight' ? renderWeights() : renderAerobics()}
      </div>
    </div>
  );
};

const EmptyState = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <div className="opacity-20 mb-4">{icon}</div>
    <p className="font-medium">{label}</p>
    <p className="text-xs">Registre uma atividade no botão (+)</p>
  </div>
);

export default WeightList;
