
import React from 'react';
import { UserProfile } from '../types';
import { User, Ruler, Target, ChevronRight } from 'lucide-react';

interface ProfileSettingsProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, setProfile }) => {
  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col items-center py-6">
        <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center border-4 border-[#00C896]/10 mb-4">
          <User size={48} className="text-[#00C896]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{profile.name || 'Seu Perfil'}</h2>
        <p className="text-slate-400 text-sm font-medium">Configurações de Saúde</p>
      </div>

      <div className="space-y-4">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Informações Básicas</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                  <User size={20} />
                </div>
                <span className="font-semibold text-slate-700">Nome</span>
              </div>
              <input 
                type="text" 
                value={profile.name || ''} 
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: João Silva"
                className="text-right focus:outline-none text-slate-500 font-medium placeholder-slate-300"
              />
            </div>

            <div className="h-[1px] bg-slate-50 w-full"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
                  <Ruler size={20} />
                </div>
                <span className="font-semibold text-slate-700">Altura</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={profile.height} 
                  onChange={(e) => handleChange('height', parseInt(e.target.value))}
                  className="text-right focus:outline-none text-slate-500 font-medium w-16"
                />
                <span className="text-slate-400 text-sm font-bold">cm</span>
              </div>
            </div>

            <div className="h-[1px] bg-slate-50 w-full"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00C896]/10 rounded-xl text-[#00C896]">
                  <Target size={20} />
                </div>
                <span className="font-semibold text-slate-700">Meta</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={profile.targetWeight || ''} 
                  onChange={(e) => handleChange('targetWeight', parseFloat(e.target.value))}
                  placeholder="0.0"
                  className="text-right focus:outline-none text-slate-500 font-medium w-16"
                />
                <span className="text-slate-400 text-sm font-bold">kg</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Aplicativo</h3>
          <div className="space-y-4">
            <button className="w-full flex justify-between items-center group">
              <span className="text-slate-700 font-semibold">Unidades (kg/cm)</span>
              <ChevronRight size={18} className="text-slate-300 group-active:translate-x-1 transition-transform" />
            </button>
            <button className="w-full flex justify-between items-center group">
              <span className="text-slate-700 font-semibold">Notificações</span>
              <ChevronRight size={18} className="text-slate-300 group-active:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                if(confirm('Deseja realmente apagar todos os dados?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full text-left text-red-500 font-semibold mt-4 pt-4 border-t border-slate-50"
            >
              Limpar Todos os Dados
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;
