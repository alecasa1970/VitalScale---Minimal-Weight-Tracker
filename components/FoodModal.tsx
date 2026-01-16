
import React, { useState } from 'react';
import { X, Check, Utensils, Zap, Calendar } from 'lucide-react';

interface FoodModalProps {
  onClose: () => void;
  onSave: (description: string, calories: number, date: string) => void;
}

const FoodModal: React.FC<FoodModalProps> = ({ onClose, onSave }) => {
  const getTodayLocalString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(getTodayLocalString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calNum = parseInt(calories);
    if (description && !isNaN(calNum) && calNum >= 0) {
      onSave(description, calNum, date);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-white rounded-t-[32px] p-8 fade-in shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-900">Registrar Refeição</h2>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                Refeição
              </label>
              <input
                autoFocus
                type="text"
                placeholder="Ex: Almoço Saudável"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl font-semibold text-slate-700 focus:outline-none border border-transparent focus:border-blue-400/30"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                Calorias (kcal)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-blue-500 text-xl focus:outline-none border border-transparent focus:border-blue-400/30"
                />
                <Zap size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl font-semibold text-slate-600 focus:outline-none border border-transparent focus:border-blue-400/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!description || !calories}
            className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check size={24} />
            Salvar Refeição
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoodModal;
