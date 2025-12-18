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
    <div className="w-full space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Market Region</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Thailand"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/50 border border-border focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/40"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Network Operator</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="e.g. AIS"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/50 border border-border focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/40"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setLang(Language.ENGLISH)}
                className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${lang === Language.ENGLISH ? 'bg-white text-accent shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.CHINESE)}
                className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${lang === Language.CHINESE ? 'bg-white text-accent shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !country || !operator}
          className="w-full h-16 bg-accent-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          <span className="text-lg">Generate Strategy Report</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
      
      <p className="text-[10px] text-muted-foreground/60 text-center font-mono uppercase tracking-[0.1em]">
        Powered by Gemini 3 Pro • Real-time Spectrum Grounding
      </p>
    </div>
  );
};

export default InputSection;