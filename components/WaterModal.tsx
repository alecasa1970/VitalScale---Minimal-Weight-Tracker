
import React, { useState } from 'react';
import { X, Check, Droplets, Calendar, GlassWater } from 'lucide-react';

interface WaterModalProps {
  onClose: () => void;
  onSave: (amount: number, date: string) => void;
}

const WaterModal: React.FC<WaterModalProps> = ({ onClose, onSave }) => {
  const getTodayLocalString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayLocalString());

  const quickOptions = [250, 350, 500, 1000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount);
    if (!isNaN(amountNum) && amountNum > 0) {
      onSave(amountNum, date);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-white rounded-t-[32px] p-8 fade-in shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-900">Registrar Água</h2>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1">
              Quantidade (ml)
            </label>
            <div className="relative">
              <input
                autoFocus
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-6xl font-bold text-center w-48 focus:outline-none text-blue-500 placeholder-slate-100 bg-transparent"
              />
              <span className="absolute -right-8 bottom-2 text-2xl font-bold text-slate-300 italic">ml</span>
            </div>
            
            <div className="flex gap-2 mt-8 flex-wrap justify-center">
              {quickOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAmount(opt.toString())}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    amount === opt.toString() 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20' 
                      : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  {opt}ml
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl text-center font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={!amount}
            className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check size={24} />
            Salvar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

export default WaterModal;
