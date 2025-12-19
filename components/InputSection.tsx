
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
            <label className="font-mono text-[11px] font-black uppercase tracking-[0.5em] text-foreground/40 ml-1">Market Geography</label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="UNITED KINGDOM"
                className="w-full pl-16 pr-6 py-5 rounded-md bg-white border-0 text-foreground font-bold text-lg placeholder:text-foreground/10 focus:ring-4 focus:ring-primary focus:outline-none transition-all uppercase tracking-tight"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-mono text-[11px] font-black uppercase tracking-[0.5em] text-foreground/40 ml-1">Target Operator</label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20">
                <Building2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="VODAFONE"
                className="w-full pl-16 pr-6 py-5 rounded-md bg-white border-0 text-foreground font-bold text-lg placeholder:text-foreground/10 focus:ring-4 focus:ring-primary focus:outline-none transition-all uppercase tracking-tight"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex bg-white p-1.5 rounded-md">
              <button
                type="button"
                onClick={() => setLang(Language.ENGLISH)}
                className={`flex-1 py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-200 ${lang === Language.ENGLISH ? 'bg-primary text-white scale-100' : 'text-foreground/30 hover:bg-muted'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.CHINESE)}
                className={`flex-1 py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-200 ${lang === Language.CHINESE ? 'bg-primary text-white scale-100' : 'text-foreground/30 hover:bg-muted'}`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !country || !operator}
          className="w-full h-20 bg-foreground text-white rounded-md font-black text-[13px] uppercase tracking-[0.4em] flex items-center justify-center gap-5 shadow-none hover:bg-primary hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-20 disabled:scale-100"
        >
          <span>Initiate Strategic Analysis</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default InputSection;
