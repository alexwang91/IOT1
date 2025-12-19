
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
          <div className="space-y-2.5">
            <label className="font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-slate-300 ml-1">Market Geography</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United Kingdom"
                className="w-full pl-12 pr-5 py-4.5 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/[0.03] outline-none transition-all font-medium text-[13px] text-slate-900 placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-slate-300 ml-1">Target Carrier</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="e.g. Vodafone"
                className="w-full pl-12 pr-5 py-4.5 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/[0.03] outline-none transition-all font-medium text-[13px] text-slate-900 placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
              <button
                type="button"
                onClick={() => setLang(Language.ENGLISH)}
                className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${lang === Language.ENGLISH ? 'bg-white text-accent shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.CHINESE)}
                className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${lang === Language.CHINESE ? 'bg-white text-accent shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !country || !operator}
          className="w-full py-6 bg-accent text-white rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-accent/20 hover:bg-accent-secondary hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none"
        >
          <span>Initiate Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default InputSection;
