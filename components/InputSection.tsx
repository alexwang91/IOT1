
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="font-mono text-[8px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-1">Market Geography</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United Kingdom"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-accent/40 focus:ring-4 focus:ring-accent/[0.02] outline-none transition-all font-medium text-[12px] text-slate-900 placeholder:text-slate-300 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[8px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-1">Strategic Target</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="e.g. Vodafone"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-accent/40 focus:ring-4 focus:ring-accent/[0.02] outline-none transition-all font-medium text-[12px] text-slate-900 placeholder:text-slate-300 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLang(Language.ENGLISH)}
                className={`flex-1 py-2.5 rounded-lg text-[8px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${lang === Language.ENGLISH ? 'bg-white text-accent shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.CHINESE)}
                className={`flex-1 py-2.5 rounded-lg text-[8px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${lang === Language.CHINESE ? 'bg-white text-accent shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !country || !operator}
          className="w-full py-5 bg-accent text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-lg shadow-accent/10 hover:bg-accent-secondary hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-500 disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none"
        >
          <span>Initiate Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default InputSection;
