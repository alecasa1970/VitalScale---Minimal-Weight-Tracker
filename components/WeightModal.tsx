
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface WeightModalProps {
  onClose: () => void;
  onSave: (weight: number, date: string) => void;
}

const WeightModal: React.FC<WeightModalProps> = ({ onClose, onSave }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    if (!isNaN(weightNum) && weightNum > 0) {
      onSave(weightNum, date);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-white rounded-t-[32px] p-8 fade-in shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-900">Nova Pesagem</h2>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <input
                autoFocus
                type="number"
                step="0.1"
                placeholder="0.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-6xl font-bold text-center w-48 focus:outline-none text-[#00C896] placeholder-slate-100"
              />
              <span className="absolute -right-8 bottom-2 text-2xl font-bold text-slate-300 italic">kg</span>
            </div>
            <div className="h-[2px] w-32 bg-[#00C896]/10 mt-2"></div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl text-center font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00C896]/20 border border-transparent focus:border-[#00C896]/30"
            />
          </div>

          <button
            type="submit"
            disabled={!weight}
            className="w-full bg-[#00C896] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#00C896]/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check size={24} />
            Salvar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

export default WeightModal;
