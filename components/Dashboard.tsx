
import React from 'react';
import { WeightEntry, AerobicEntry, BMIResult, UserProfile } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingDown, TrendingUp, Minus, Info, Heart, Activity, Zap } from 'lucide-react';

interface DashboardProps {
  weights: WeightEntry[];
  aerobics: AerobicEntry[];
  bmi: BMIResult;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ weights, aerobics, bmi, profile }) => {
  const latestWeight = weights.length > 0 ? weights[0].weight : 0;
  const previousWeight = weights.length > 1 ? weights[1].weight : latestWeight;
  const diff = latestWeight - previousWeight;

  // Cálculo de minutos aeróbicos para HOJE
  const today = new Date().toISOString().split('T')[0];
  const aerobicMinutes = aerobics
    .filter(a => a.date === today)
    .reduce((sum, current) => sum + current.duration, 0);
    
  const aerobicGoal = 30;
  const aerobicProgress = (aerobicMinutes / aerobicGoal) * 100;

  const chartData = [...weights]
    .reverse()
    .slice(-15) 
    .map(w => ({
      date: new Date(w.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      fullDate: new Date(w.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      weight: w.weight
    }));

  const weightStatusText = () => {
    if (bmi.toIdeal === 0) return "Você está no peso ideal!";
    if (bmi.value > 24.9) return `Faltam ${bmi.toIdeal} kg para o peso ideal`;
    return `Ganhe ${bmi.toIdeal} kg para o peso ideal`;
  };

  return (
    <div className="space-y-6 pt-4 pb-10">
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

      {/* Grid for BMI and Aerobics */}
      <div className="grid grid-cols-2 gap-4">
        {/* IMC / Idade Card */}
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">IMC / Idade</span>
            <Info size={14} className="text-slate-300" />
          </div>
          <div className={`text-2xl font-bold ${bmi.color}`}>
            {bmi.value || '--'}
            <span className="text-slate-300 text-sm font-normal ml-1">/ {profile.age || '--'}a</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">{bmi.category}</div>
        </div>

        {/* Card Aeróbico Real */}
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Aeróbico</span>
            <Activity size={14} className="text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {aerobicMinutes} 
            <span className="text-slate-300 text-sm font-normal ml-1">min</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-orange-400 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(aerobicProgress, 100)}%` }}
            ></div>
          </div>
          <div className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">
            Hoje • Meta {aerobicGoal} min
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
            <Zap size={18} className="text-[#00C896]" />
            Evolução de Peso
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Histórico</span>
        </div>
        <div className="h-56 w-full -ml-4">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                  interval="preserveStartEnd"
                />
                <YAxis hide={true} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold', padding: '12px' }}
                  itemStyle={{ color: '#00C896' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) return payload[0].payload.fullDate;
                    return label;
                  }}
                  formatter={(value) => [`${value} kg`, 'Peso']}
                />
                <Area type="monotone" dataKey="weight" stroke="#00C896" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" animationDuration={2000} dot={{ r: 4, fill: '#00C896', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#00C896' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 text-sm italic text-center px-10">
              Registre pelo menos duas pesagens para ver seu progresso.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
