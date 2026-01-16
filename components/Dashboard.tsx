
import React from 'react';
import { WeightEntry, BMIResult, UserProfile } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingDown, TrendingUp, Minus, Info, Heart } from 'lucide-react';

interface DashboardProps {
  weights: WeightEntry[];
  bmi: BMIResult;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ weights, bmi, profile }) => {
  const latestWeight = weights.length > 0 ? weights[0].weight : 0;
  const previousWeight = weights.length > 1 ? weights[1].weight : latestWeight;
  const diff = latestWeight - previousWeight;

  const chartData = [...weights]
    .reverse()
    .slice(-7)
    .map(w => ({
      date: new Date(w.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
      weight: w.weight
    }));

  const weightStatusText = () => {
    if (bmi.toIdeal === 0) return "Você está no peso ideal!";
    if (bmi.value > 24.9) return `Faltam ${bmi.toIdeal} kg para o peso ideal`;
    return `Ganhe ${bmi.toIdeal} kg para o peso ideal`;
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Weight Summary Card */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center">
        <span className="text-slate-400 text-sm font-medium mb-1">Peso Atual</span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-slate-900">
            {latestWeight || '--'}
          </span>
          <span className="text-slate-400 font-semibold text-xl">kg</span>
        </div>
        
        {weights.length > 1 && (
          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
            diff < 0 ? 'bg-green-50 text-green-600' : diff > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
          }`}>
            {diff < 0 ? <TrendingDown size={14} /> : diff > 0 ? <TrendingUp size={14} /> : <Minus size={14} />}
            {Math.abs(diff).toFixed(1)} kg desde a última pesagem
          </div>
        )}
      </div>

      {/* Grid for BMI and Age */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">IMC / Idade</span>
            <Info size={14} className="text-slate-300" />
          </div>
          <div className={`text-2xl font-bold ${bmi.color}`}>
            {bmi.value || '--'}
            <span className="text-slate-300 text-sm font-normal ml-2">/ {profile.age || '--'}a</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">{bmi.category}</div>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Meta Peso</span>
            <TrendingDown size={14} className="text-slate-300" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{profile.targetWeight ? `${profile.targetWeight} kg` : '--'}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">
            {profile.targetWeight && latestWeight ? `${(latestWeight - profile.targetWeight).toFixed(1)} kg para chegar` : 'Defina no perfil'}
          </div>
        </div>
      </div>

      {/* Healthy Zone Info */}
      <div className="bg-[#00C896]/5 p-5 rounded-[24px] border border-[#00C896]/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#00C896] text-white rounded-xl">
            <Heart size={16} />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Peso Ideal (IMC 18.5 - 24.9)</h4>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600 text-xs font-medium">Sua faixa saudável:</span>
          <span className="text-[#00C896] font-bold text-sm">{bmi.idealRange.min} - {bmi.idealRange.max} kg</span>
        </div>
        <div className="mt-2 pt-2 border-t border-[#00C896]/10 text-center">
           <span className={`text-xs font-bold ${bmi.toIdeal > 0 ? (bmi.value > 24.9 ? 'text-red-500' : 'text-blue-500') : 'text-green-600'}`}>
              {weightStatusText()}
           </span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
        <h3 className="text-slate-900 font-bold mb-6 text-sm flex items-center gap-2">
          <TrendingDown size={18} className="text-[#00C896]" />
          Progresso Semanal
        </h3>
        <div className="h-48 w-full">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C896" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  hide={true} 
                  domain={['dataMin - 2', 'dataMax + 2']} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#00C896" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 text-sm italic">
              Adicione mais pesagens para ver o gráfico
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
