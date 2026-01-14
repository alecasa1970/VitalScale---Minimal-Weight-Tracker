
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, RefreshCw, Quote } from 'lucide-react';
import { WeightEntry, BMIResult } from '../types';
import { getAIInsights } from '../services/geminiService';

interface AIAssistantProps {
  weights: WeightEntry[];
  bmi: BMIResult;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ weights, bmi }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsight = async () => {
    if (weights.length === 0) return;
    setIsLoading(true);
    const result = await getAIInsights(weights, bmi);
    setInsight(result);
    setIsLoading(false);
  };

  useEffect(() => {
    if (weights.length > 0 && !insight) {
      fetchInsight();
    }
  }, [weights, bmi, insight]);

  return (
    <div className="space-y-6 pt-4">
      <div className="bg-gradient-to-br from-[#00C896] to-[#00A87E] p-8 rounded-[32px] text-white shadow-lg shadow-[#00C896]/20 relative overflow-hidden">
        <Sparkles size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
            <BrainCircuit size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Insights da VitalScale</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Nossa inteligência artificial analisa seu histórico para fornecer dicas personalizadas.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 min-h-[200px] flex flex-col justify-center relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 text-slate-400">
            <RefreshCw size={32} className="animate-spin text-[#00C896]" />
            <p className="text-sm font-medium">Analisando seus dados...</p>
          </div>
        ) : insight ? (
          <div className="fade-in">
            <Quote size={32} className="text-[#00C896]/10 absolute top-6 left-6" />
            <p className="text-slate-700 text-lg font-medium leading-relaxed italic text-center px-4">
              "{insight}"
            </p>
            <div className="flex justify-center mt-8">
              <button 
                onClick={fetchInsight}
                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-[#00C896] transition-colors"
              >
                <RefreshCw size={12} />
                Gerar Novo Insight
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-10">
            <BrainCircuit size={48} className="mx-auto mb-4 opacity-20" />
            <p>Adicione pesagens para receber insights.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
          <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00C896]"></span>
            Dica do Dia
          </h4>
          <p className="text-slate-500 text-xs leading-relaxed">
            Tente beber 500ml de água logo ao acordar para acelerar seu metabolismo e manter a hidratação desde cedo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
