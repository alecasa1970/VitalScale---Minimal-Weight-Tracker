
import React, { useState } from 'react';
import { X, Check, MapPin, Timer, Calendar } from 'lucide-react';

interface AerobicModalProps {
  onClose: () => void;
  onSave: (distance: number, duration: number, date: string) => void;
}

const AerobicModal: React.FC<AerobicModalProps> = ({ onClose, onSave }) => {
  const getTodayLocalString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(getTodayLocalString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const distNum = parseFloat(distance);
    const durNum = parseInt(duration);
    if (!isNaN(distNum) && distNum >= 0 && !isNaN(durNum) && durNum > 0) {
      onSave(distNum, durNum, date);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-white rounded-t-[32px] p-8 fade-in shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-900">Novo Aeróbico</h2>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <MapPin size={10} /> Distância
              </label>
              <div className="relative">
                <input
                  autoFocus
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="text-4xl font-bold text-center w-28 focus:outline-none text-orange-400 placeholder-slate-100 bg-transparent"
                />
                <span className="absolute -right-6 bottom-1 text-sm font-bold text-slate-300 italic">km</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Timer size={10} /> Tempo
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="text-4xl font-bold text-center w-28 focus:outline-none text-orange-400 placeholder-slate-100 bg-transparent"
                />
                <span className="absolute -right-6 bottom-1 text-sm font-bold text-slate-300 italic">min</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">Data do Exercício</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl text-center font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-400/20 border border-transparent focus:border-orange-400/30"
            />
          </div>

          <button
            type="submit"
            disabled={!distance || !duration}
            className="w-full bg-orange-400 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-400/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check size={24} />
            Salvar Atividade
          </button>
        </form>
      </div>
    </div>
  );
};

export default AerobicModal;
