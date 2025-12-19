
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
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Target Market</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United Kingdom"
                className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-muted/30 border border-border focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-semibold text-foreground placeholder:text-muted-foreground/30"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Operator Name</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="e.g. Vodafone"
                className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-muted/30 border border-border focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all font-semibold text-foreground placeholder:text-muted-foreground/30"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/30 rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setLang(Language.ENGLISH)}
                className={`py-3 px-3 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${lang === Language.ENGLISH ? 'bg-white text-accent shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.CHINESE)}
                className={`py-3 px-3 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${lang === Language.CHINESE ? 'bg-white text-accent shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !country || !operator}
          className="w-full py-8 bg-accent-gradient text-white rounded-[2rem] font-bold text-2xl flex items-center justify-center gap-4 shadow-2xl shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          <span>Generate Insights</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </form>
    </div>
  );
};

export default InputSection;
