
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Scale, 
  History, 
  Plus, 
  BrainCircuit, 
  User, 
  Settings,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';
import { WeightEntry, UserProfile, BMIResult, BMICategory } from './types';
import Dashboard from './components/Dashboard';
import WeightList from './components/WeightList';
import WeightModal from './components/WeightModal';
import AIAssistant from './components/AIAssistant';
import ProfileSettings from './components/ProfileSettings';

const STORAGE_KEY_WEIGHTS = 'vitalscale_weights';
const STORAGE_KEY_PROFILE = 'vitalscale_profile';

const App: React.FC = () => {
  // State
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ height: 170, age: 25 });
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'ai' | 'profile'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const savedWeights = localStorage.getItem(STORAGE_KEY_WEIGHTS);
    const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
    
    if (savedWeights) setWeights(JSON.parse(savedWeights));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  const addWeightEntry = useCallback((weight: number, date: string) => {
    const newEntry: WeightEntry = {
      id: crypto.randomUUID(),
      weight,
      date
    };
    setWeights(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsModalOpen(false);
  }, []);

  const deleteWeightEntry = useCallback((id: string) => {
    setWeights(prev => prev.filter(w => w.id !== id));
  }, []);

  const bmi = useMemo((): BMIResult => {
    if (!profile.height || weights.length === 0) {
      return { 
        value: 0, 
        category: 'Unknown', 
        color: 'text-gray-400', 
        idealRange: { min: 0, max: 0 }, 
        toIdeal: 0 
      };
    }
    const latestWeight = weights[0].weight;
    const heightInMeters = profile.height / 100;
    const value = latestWeight / (heightInMeters * heightInMeters);
    
    // Ideal range calculation (BMI 18.5 to 24.9)
    const minIdeal = 18.5 * (heightInMeters * heightInMeters);
    const maxIdeal = 24.9 * (heightInMeters * heightInMeters);
    
    let toIdeal = 0;
    if (value < 18.5) {
      toIdeal = minIdeal - latestWeight; // Positive means need to gain
    } else if (value > 24.9) {
      toIdeal = latestWeight - maxIdeal; // Positive means need to lose
    }

    let category: BMICategory = 'Normal';
    let color = 'text-green-500';

    if (value < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
    } else if (value < 25) {
      category = 'Normal';
      color = 'text-green-500';
    } else if (value < 30) {
      category = 'Overweight';
      color = 'text-yellow-500';
    } else {
      category = 'Obese';
      color = 'text-red-500';
    }

    return { 
      value: parseFloat(value.toFixed(1)), 
      category, 
      color,
      idealRange: {
        min: parseFloat(minIdeal.toFixed(1)),
        max: parseFloat(maxIdeal.toFixed(1))
      },
      toIdeal: parseFloat(toIdeal.toFixed(1))
    };
  }, [weights, profile.height]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard weights={weights} bmi={bmi} profile={profile} />;
      case 'history':
        return <WeightList weights={weights} onDelete={deleteWeightEntry} />;
      case 'ai':
        return <AIAssistant weights={weights} bmi={bmi} />;
      case 'profile':
        return <ProfileSettings profile={profile} setProfile={setProfile} />;
      default:
        return <Dashboard weights={weights} bmi={bmi} profile={profile} />;
    }
  };

  return (
    <div className="mobile-frame flex flex-col h-screen overflow-hidden text-slate-800">
      {/* Header */}
      <header className="p-6 pb-2 flex justify-between items-center bg-[#F5F5F7] z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">VitalScale</h1>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Sua Jornada de Saúde</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100 overflow-hidden">
          <User size={20} className="text-slate-400" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 fade-in">
        {renderContent()}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-8 w-14 h-14 bg-[#00C896] text-white rounded-full shadow-lg shadow-[#00C896]/30 flex items-center justify-center transition-transform active:scale-95 z-20"
      >
        <Plus size={28} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-8 py-4 flex justify-between items-center z-20 max-w-[480px] mx-auto">
        <NavButton 
          active={activeTab === 'home'} 
          icon={<Scale size={24} />} 
          label="Início" 
          onClick={() => setActiveTab('home')} 
        />
        <NavButton 
          active={activeTab === 'history'} 
          icon={<History size={24} />} 
          label="Histórico" 
          onClick={() => setActiveTab('history')} 
        />
        <NavButton 
          active={activeTab === 'ai'} 
          icon={<BrainCircuit size={24} />} 
          label="Insights AI" 
          onClick={() => setActiveTab('ai')} 
        />
        <NavButton 
          active={activeTab === 'profile'} 
          icon={<Settings size={24} />} 
          label="Perfil" 
          onClick={() => setActiveTab('profile')} 
        />
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <WeightModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={addWeightEntry} 
        />
      )}
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

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
