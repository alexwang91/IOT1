import React, { useState } from 'react';
import { Language } from '../types';
import { Globe, Building2, Loader2, Search } from 'lucide-react';

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
    <div className="w-full max-w-5xl mx-auto p-12 bg-clay rounded-[40px] neumorphic-extruded border border-white/10 my-12 transition-all duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-clay-dark mb-4 tracking-tight font-display">
          FWA Strategy <span className="text-accent">Insight AI</span>
        </h1>
        <p className="text-clay-muted text-lg max-w-2xl mx-auto">
          Molding global spectrum data and market intelligence into actionable strategic reports.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-clay-muted mb-3 ml-1">Target Country</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-muted group-focus-within:text-accent transition-colors">
              <Globe className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g., Thailand"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-clay neumorphic-inset-deep text-clay-dark placeholder-clay-muted focus:ring-2 focus:ring-accent/50 outline-none transition-all font-medium"
              required
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-clay-muted mb-3 ml-1">Telecom Operator</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-muted group-focus-within:text-accent transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="e.g., AIS"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-clay neumorphic-inset-deep text-clay-dark placeholder-clay-muted focus:ring-2 focus:ring-accent/50 outline-none transition-all font-medium"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-clay-muted mb-3 ml-1">Language</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="w-full px-4 py-4 rounded-2xl bg-clay neumorphic-inset text-clay-dark font-semibold outline-none appearance-none cursor-pointer hover:bg-clay/50 transition-colors"
          >
            <option value={Language.ENGLISH}>English</option>
            <option value={Language.CHINESE}>中文</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-[60px] rounded-2xl flex items-center justify-center gap-2 font-bold transition-all duration-300 neumorphic-extruded neumorphic-button-active ${
              isLoading 
                ? 'bg-clay text-clay-muted opacity-80' 
                : 'bg-accent text-white hover:bg-accent-light'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputSection;