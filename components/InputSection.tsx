import React, { useState } from 'react';
import { Language } from '../types';
import { Globe, Building2, ArrowRight } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (country: string, operator: string, lang: Language) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [country, setCountry] = useState('');
  const [operator, setOperator] = useState('');
  const [lang, setLang] = useState<Language>(Language.CHINESE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (country && operator) {
      onGenerate(country, operator, lang);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Market Region</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country Name"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-semibold text-foreground placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Telecom Entity</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="Operator Name"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-semibold text-foreground placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
              <button
                type="button"
                onClick={() => setLang(Language.ENGLISH)}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${lang === Language.ENGLISH ? 'bg-white text-accent shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.CHINESE)}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${lang === Language.CHINESE ? 'bg-white text-accent shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !country || !operator}
          className="w-full py-7 bg-accent text-white rounded-[1.5rem] font-bold text-xl flex items-center justify-center gap-3 shadow-2xl shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          <span>Run Strategic Analysis</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default InputSection;