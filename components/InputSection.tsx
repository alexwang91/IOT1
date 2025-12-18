import React, { useState } from 'react';
import { Language } from '../types';
import { Globe, Building2, Search, ArrowRight } from 'lucide-react';

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
    <div className="w-full bg-white rounded-[2rem] border border-border shadow-2xl shadow-accent/5 p-8 lg:p-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Target Market</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Thailand"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/30 border border-border focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Carrier Name</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="e.g. AIS"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/30 border border-border focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Output Language</label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-muted/50 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setLang(Language.ENGLISH)}
                className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${lang === Language.ENGLISH ? 'bg-white text-accent shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.CHINESE)}
                className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${lang === Language.CHINESE ? 'bg-white text-accent shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !country || !operator}
          className="w-full h-14 bg-accent-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          <span>Run AI Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
      
      <div className="mt-8 pt-8 border-t border-border/50">
        <p className="text-[11px] text-muted-foreground text-center font-medium">
          Generates a comprehensive report using Gemini 3 Pro & Google Search grounding.
        </p>
      </div>
    </div>
  );
};

export default InputSection;