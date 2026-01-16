
import React from 'react';
import { WeightEntry, WaterEntry, AerobicEntry, BMIResult, UserProfile, BMICategory } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingDown, TrendingUp, Minus, Info, Heart, Droplets, Activity, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardProps {
  weights: WeightEntry[];
  waters: WaterEntry[];
  aerobics: AerobicEntry[];
  bmi: BMIResult;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ weights, waters, aerobics, bmi, profile }) => {
  const latestWeight = weights.length > 0 ? weights[0].weight : 0;
  const previousWeight = weights.length > 1 ? weights[1].weight : latestWeight;
  const diff = latestWeight - previousWeight;

  const today = new Date().toISOString().split('T')[0];
  
  // Água de hoje
  const totalWaterMl = waters
    .filter(w => w.date === today)
    .reduce((sum, current) => sum + current.amount, 0);
  const waterGoalMl = 2500;
  const waterProgress = (totalWaterMl / waterGoalMl) * 100;

  // Aeróbico de hoje
  const todaysAerobics = aerobics.filter(a => a.date === today);
  const totalKm = todaysAerobics.reduce((sum, current) => sum + current.distance, 0);
  const totalMin = todaysAerobics.reduce((sum, current) => sum + current.duration, 0);

  const chartData = [...weights]
    .reverse()
    .slice(-15) 
    .map(w => ({
      date: new Date(w.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      fullDate: new Date(w.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      weight: w.weight
    }));

  const getStatusLabel = (category: BMICategory) => {
    switch(category) {
      case 'Underweight': return 'Abaixo do Peso';
      case 'Normal': return 'Peso Ideal';
      case 'Overweight': return 'Sobrepeso';
      case 'Obese': return 'Obesidade';
      default: return 'Indefinido';
    }
  };

  const getStatusDescription = () => {
    if (bmi.category === 'Normal') {
      return "Parabéns! Você está na faixa de peso saudável.";
    } else if (bmi.toIdeal > 0) {
      const action = bmi.category === 'Underweight' ? 'ganhar' : 'perder';
      return `Você precisa ${action} cerca de ${bmi.toIdeal}kg para atingir o peso normal.`;
    }
    return "Adicione sua altura e peso para ver o status.";
  };

  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Principal: Peso e Status de Saúde */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <span className="text-slate-400 text-sm font-medium mb-1">Peso Atual</span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-slate-900">
            {latestWeight || '--'}
          </span>
          <span className="text-slate-400 font-semibold text-xl">kg</span>
        </div>
        
        {weights.length > 0 && (
          <div className="mt-4 w-full pt-4 border-t border-slate-50">
            <div className="flex items-center justify-center gap-2">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                bmi.category === 'Normal' ? 'bg-green-100 text-green-700' : 
                bmi.category === 'Underweight' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {getStatusLabel(bmi.category)}
              </span>
              <span className="text-slate-900 font-bold text-sm">IMC: {bmi.value}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500 font-medium leading-relaxed max-w-[250px] mx-auto">
              {getStatusDescription()}
            </p>
          </div>
        )}

        {weights.length > 1 && (
          <div className={`mt-4 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
            diff < 0 ? 'bg-green-50 text-green-600' : diff > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
          }`}>
            {diff < 0 ? <TrendingDown size={12} /> : diff > 0 ? <TrendingUp size={12} /> : <Minus size={12} />}
            {Math.abs(diff).toFixed(1)} kg desde a última vez
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Card de Água */}
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Hidratação</span>
            <Droplets size={14} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalWaterMl >= 1000 ? (totalWaterMl / 1000).toFixed(1) : totalWaterMl}
            <span className="text-slate-300 text-sm font-normal ml-1">{totalWaterMl >= 1000 ? 'L' : 'ml'}</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full transition-all" style={{ width: `${Math.min(waterProgress, 100)}%` }}></div>
          </div>
        </div>

        {/* Card de Exercício */}
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Atividade</span>
            <Activity size={14} className="text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalMin} 
            <span className="text-slate-300 text-sm font-normal ml-1">min</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">{totalKm.toFixed(1)} km hoje</div>
        </div>
      </div>

      {/* Faixa Saudável Detalhada */}
      <div className="bg-[#00C896]/5 p-5 rounded-[24px] border border-[#00C896]/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00C896] text-white rounded-xl">
              <Heart size={16} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Meta de Peso</h4>
          </div>
          {bmi.category === 'Normal' && <CheckCircle2 size={20} className="text-[#00C896]" />}
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Faixa Ideal para sua altura:</span>
            <span className="text-[#00C896] font-extrabold">{bmi.idealRange.min} - {bmi.idealRange.max} kg</span>
          </div>
          {profile.targetWeight && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Sua meta pessoal:</span>
              <span className="text-slate-900 font-extrabold">{profile.targetWeight} kg</span>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Evolução */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
            <Zap size={18} className="text-[#00C896]" />
            Histórico de Peso
          </h3>
        </div>
        <div className="h-56 w-full -ml-4">
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
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                <YAxis hide={true} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                  formatter={(value) => [`${value} kg`, 'Peso']}
                />
                <Area type="monotone" dataKey="weight" stroke="#00C896" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" animationDuration={2000} dot={{ r: 4, fill: '#00C896', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 text-sm italic">
              Registre pesagens para visualizar o gráfico.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
