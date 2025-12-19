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
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Market</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Saudi Arabia"
                className="w-full pl-11 pr-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-accent/5 focus:border-accent outline-none transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Telecom</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="e.g. STC"
                className="w-full pl-11 pr-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-accent/5 focus:border-accent outline-none transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button
                type="button"
                onClick={() => setLang(Language.ENGLISH)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${lang === Language.ENGLISH ? 'bg-white text-accent shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.CHINESE)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${lang === Language.CHINESE ? 'bg-white text-accent shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !country || !operator}
          className="w-full py-6 bg-accent text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_rgba(0,82,255,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(0,82,255,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          <span>Generate Insights</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default InputSection;