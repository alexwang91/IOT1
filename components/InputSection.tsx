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
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Market Location</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United Kingdom"
                className="w-full pl-10 pr-4 py-3.5 rounded-lg bg-slate-50 border border-slate-100 focus:bg-white focus:border-accent outline-none transition-all font-medium text-xs text-slate-900 placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Carrier Operator</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="e.g. EE"
                className="w-full pl-10 pr-4 py-3.5 rounded-lg bg-slate-50 border border-slate-100 focus:bg-white focus:border-accent outline-none transition-all font-medium text-xs text-slate-900 placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
              <button
                type="button"
                onClick={() => setLang(Language.ENGLISH)}
                className={`flex-1 py-2 rounded text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${lang === Language.ENGLISH ? 'bg-white text-accent shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.CHINESE)}
                className={`flex-1 py-2 rounded text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${lang === Language.CHINESE ? 'bg-white text-accent shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !country || !operator}
          className="w-full py-5 bg-slate-900 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          <span>Run Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default InputSection;