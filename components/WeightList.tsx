
import React, { useState } from 'react';
import { WeightEntry, WaterEntry, AerobicEntry } from '../types';
import { Trash2, Scale, Droplets, Activity, Timer, MapPin } from 'lucide-react';

interface WeightListProps {
  weights: WeightEntry[];
  waters: WaterEntry[];
  aerobics: AerobicEntry[];
  onWeightDelete: (id: string) => void;
  onWaterDelete: (id: string) => void;
  onAerobicDelete: (id: string) => void;
}

const WeightList: React.FC<WeightListProps> = ({ weights, waters, aerobics, onWeightDelete, onWaterDelete, onAerobicDelete }) => {
  const [viewType, setViewType] = useState<'weight' | 'water' | 'aerobic'>('weight');

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

  const renderWaters = () => {
    if (waters.length === 0) return <EmptyState label="Nenhum registro de água." icon={<Droplets size={48} />} />;

    return waters.map((entry) => {
      const date = new Date(entry.date + 'T00:00:00');
      return (
        <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group fade-in">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Droplets size={18} />
            </div>
            <div>
              <div className="text-slate-900 font-bold text-base">{entry.amount} ml</div>
              <div className="text-slate-400 text-xs font-medium">
                {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
          <button onClick={() => onWaterDelete(entry.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
        </div>
      );
    });
  };

  const renderAerobics = () => {
    if (aerobics.length === 0) return <EmptyState label="Nenhum exercício registrado." icon={<Activity size={48} />} />;

    return aerobics.map((entry) => {
      const date = new Date(entry.date + 'T00:00:00');
      return (
        <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group fade-in">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Activity size={18} />
            </div>
            <div>
              <div className="text-slate-900 font-bold text-base flex items-center gap-2">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {entry.distance}km</span>
                <span className="text-slate-200">|</span>
                <span className="flex items-center gap-1"><Timer size={14} className="text-slate-400"/> {entry.duration}m</span>
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
      </div>
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
        <button 
          onClick={() => setViewType('weight')}
          className={`flex-1 px-2 py-2 rounded-xl text-[10px] font-bold transition-all ${viewType === 'weight' ? 'bg-white text-[#00C896] shadow-sm' : 'text-slate-400'}`}
        >
          Peso
        </button>
        <button 
          onClick={() => setViewType('water')}
          className={`flex-1 px-2 py-2 rounded-xl text-[10px] font-bold transition-all ${viewType === 'water' ? 'bg-white text-blue-500 shadow-sm' : 'text-slate-400'}`}
        >
          Água
        </button>
        <button 
          onClick={() => setViewType('aerobic')}
          className={`flex-1 px-2 py-2 rounded-xl text-[10px] font-bold transition-all ${viewType === 'aerobic' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-400'}`}
        >
          Aeróbico
        </button>
      </div>
      <div className="space-y-3">
        {viewType === 'weight' ? renderWeights() : viewType === 'water' ? renderWaters() : renderAerobics()}
      </div>
    </div>
  );
};

const EmptyState = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <div className="opacity-20 mb-4">{icon}</div>
    <p className="font-medium">{label}</p>
    <p className="text-xs">Toque no (+) para registrar</p>
  </div>
);

export default WeightList;
