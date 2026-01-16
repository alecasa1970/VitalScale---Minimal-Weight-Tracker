
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Scale, 
  History, 
  Plus, 
  BrainCircuit, 
  User, 
  Settings,
  Droplets,
  Activity,
  X
} from 'lucide-react';
import { WeightEntry, WaterEntry, AerobicEntry, UserProfile, BMIResult, BMICategory } from './types';
import Dashboard from './components/Dashboard';
import WeightList from './components/WeightList';
import WeightModal from './components/WeightModal';
import WaterModal from './components/WaterModal';
import AerobicModal from './components/AerobicModal';
import AIAssistant from './components/AIAssistant';
import ProfileSettings from './components/ProfileSettings';

const STORAGE_KEY_WEIGHTS = 'vitalscale_weights';
const STORAGE_KEY_WATER = 'vitalscale_water';
const STORAGE_KEY_AEROBIC = 'vitalscale_aerobic';
const STORAGE_KEY_PROFILE = 'vitalscale_profile';

const App: React.FC = () => {
  // State
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [waters, setWaters] = useState<WaterEntry[]>([]);
  const [aerobics, setAerobics] = useState<AerobicEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ height: 170, age: 25 });
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'ai' | 'profile'>('home');
  
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isAerobicModalOpen, setIsAerobicModalOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const savedWeights = localStorage.getItem(STORAGE_KEY_WEIGHTS);
    const savedWaters = localStorage.getItem(STORAGE_KEY_WATER);
    const savedAerobics = localStorage.getItem(STORAGE_KEY_AEROBIC);
    const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
    
    if (savedWeights) setWeights(JSON.parse(savedWeights));
    if (savedWaters) setWaters(JSON.parse(savedWaters));
    if (savedAerobics) setAerobics(JSON.parse(savedAerobics));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WATER, JSON.stringify(waters));
  }, [waters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AEROBIC, JSON.stringify(aerobics));
  }, [aerobics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  const addWeightEntry = useCallback((weight: number, date: string) => {
    const newEntry: WeightEntry = { id: crypto.randomUUID(), weight, date };
    setWeights(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsWeightModalOpen(false);
  }, []);

  const addWaterEntry = useCallback((amount: number, date: string) => {
    const newEntry: WaterEntry = { id: crypto.randomUUID(), amount, date };
    setWaters(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsWaterModalOpen(false);
  }, []);

  const addAerobicEntry = useCallback((distance: number, duration: number, date: string) => {
    const newEntry: AerobicEntry = { id: crypto.randomUUID(), distance, duration, date };
    setAerobics(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsAerobicModalOpen(false);
  }, []);

  const deleteWeightEntry = useCallback((id: string) => {
    setWeights(prev => prev.filter(w => w.id !== id));
  }, []);

  const deleteWaterEntry = useCallback((id: string) => {
    setWaters(prev => prev.filter(w => w.id !== id));
  }, []);

  const deleteAerobicEntry = useCallback((id: string) => {
    setAerobics(prev => prev.filter(a => a.id !== id));
  }, []);

  const bmi = useMemo((): BMIResult => {
    if (!profile.height || weights.length === 0) {
      return { 
        value: 0, category: 'Unknown', color: 'text-gray-400', 
        idealRange: { min: 0, max: 0 }, toIdeal: 0 
      };
    }
    const latestWeight = weights[0].weight;
    const heightInMeters = profile.height / 100;
    const value = latestWeight / (heightInMeters * heightInMeters);
    const minIdeal = 18.5 * (heightInMeters * heightInMeters);
    const maxIdeal = 24.9 * (heightInMeters * heightInMeters);
    
    let toIdeal = 0;
    if (value < 18.5) toIdeal = minIdeal - latestWeight;
    else if (value > 24.9) toIdeal = latestWeight - maxIdeal;

    let category: BMICategory = 'Normal';
    let color = 'text-green-500';
    if (value < 18.5) { category = 'Underweight'; color = 'text-blue-500'; }
    else if (value < 25) { category = 'Normal'; color = 'text-green-500'; }
    else if (value < 30) { category = 'Overweight'; color = 'text-yellow-500'; }
    else { category = 'Obese'; color = 'text-red-500'; }

    return { 
      value: parseFloat(value.toFixed(1)), 
      category, color,
      idealRange: { min: parseFloat(minIdeal.toFixed(1)), max: parseFloat(maxIdeal.toFixed(1)) },
      toIdeal: parseFloat(toIdeal.toFixed(1))
    };
  }, [weights, profile.height]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard weights={weights} waters={waters} aerobics={aerobics} bmi={bmi} profile={profile} />;
      case 'history':
        return <WeightList weights={weights} waters={waters} aerobics={aerobics} onWeightDelete={deleteWeightEntry} onWaterDelete={deleteWaterEntry} onAerobicDelete={deleteAerobicEntry} />;
      case 'ai':
        return <AIAssistant weights={weights} bmi={bmi} />;
      case 'profile':
        return <ProfileSettings profile={profile} setProfile={setProfile} />;
      default:
        return <Dashboard weights={weights} waters={waters} aerobics={aerobics} bmi={bmi} profile={profile} />;
    }
  };

  return (
    <div className="mobile-frame flex flex-col h-screen overflow-hidden text-slate-800 relative">
      <header className="p-6 pb-2 flex justify-between items-center bg-[#F5F5F7] z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">VitalScale</h1>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Sua Jornada de Saúde</p>
        </div>
        <button 
          onClick={() => setActiveTab('profile')}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100 overflow-hidden active:scale-90 transition-transform"
        >
          {profile.photo ? (
            <img src={profile.photo} alt="Perfil" className="w-full h-full object-cover" />
          ) : (
            <User size={20} className="text-slate-400" />
          )}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-24 fade-in">
        {renderContent()}
      </main>

      <div className="fixed bottom-24 right-8 z-40 flex flex-col items-end gap-3">
        {isAddMenuOpen && (
          <>
            <button 
              onClick={() => { setIsWeightModalOpen(true); setIsAddMenuOpen(false); }}
              className="bg-white text-slate-700 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 font-bold text-sm fade-in active:scale-95"
            >
              <Scale size={18} className="text-[#00C896]" />
              Peso
            </button>
            <button 
              onClick={() => { setIsWaterModalOpen(true); setIsAddMenuOpen(false); }}
              className="bg-white text-slate-700 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 font-bold text-sm fade-in active:scale-95"
            >
              <Droplets size={18} className="text-blue-500" />
              Água
            </button>
            <button 
              onClick={() => { setIsAerobicModalOpen(true); setIsAddMenuOpen(false); }}
              className="bg-white text-slate-700 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 font-bold text-sm fade-in active:scale-95"
            >
              <Activity size={18} className="text-orange-500" />
              Aeróbico
            </button>
          </>
        )}
        <button 
          onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 ${isAddMenuOpen ? 'bg-slate-800 text-white rotate-45' : 'bg-[#00C896] text-white shadow-[#00C896]/30'}`}
        >
          <Plus size={28} />
        </button>
      </div>

      {isAddMenuOpen && (
        <div className="fixed inset-0 bg-black/5 z-30" onClick={() => setIsAddMenuOpen(false)}></div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-8 py-4 flex justify-between items-center z-20 max-w-[480px] mx-auto">
        <NavButton active={activeTab === 'home'} icon={<Scale size={24} />} label="Início" onClick={() => setActiveTab('home')} />
        <NavButton active={activeTab === 'history'} icon={<History size={24} />} label="Histórico" onClick={() => setActiveTab('history')} />
        <NavButton active={activeTab === 'ai'} icon={<BrainCircuit size={24} />} label="Insights AI" onClick={() => setActiveTab('ai')} />
        <NavButton active={activeTab === 'profile'} icon={<Settings size={24} />} label="Perfil" onClick={() => setActiveTab('profile')} />
      </nav>

      {isWeightModalOpen && (
        <WeightModal onClose={() => setIsWeightModalOpen(false)} onSave={addWeightEntry} />
      )}
      
      {isWaterModalOpen && (
        <WaterModal onClose={() => setIsWaterModalOpen(false)} onSave={addWaterEntry} />
      )}

      {isAerobicModalOpen && (
        <AerobicModal onClose={() => setIsAerobicModalOpen(false)} onSave={addAerobicEntry} />
      )}
    </div>
  );
};

interface NavButtonProps { active: boolean; icon: React.ReactNode; label: string; onClick: () => void; }
const NavButton: React.FC<NavButtonProps> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#00C896]' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    <span className="text-[10px] font-semibold">{label}</span>
  </button>
);

export default App;
