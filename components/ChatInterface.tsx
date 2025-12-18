import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FWAReport, Language } from '../types';
import { chatWithInsight } from '../services/geminiService';
import { Send, Bot, X, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  report: FWAReport;
  language: Language;
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ report, language, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: language === Language.ENGLISH 
        ? `I have analyzed ${report.operatorName} in ${report.country}. How can I assist you with the technical or commercial details?`
        : `我已完成对 ${report.country} ${report.operatorName} 的分析。请问您需要了解哪些技术或商业策略细节？`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const responseText = await chatWithInsight(
        [...messages, userMsg],
        userMsg.text,
        report,
        language
      );

      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-clay border-l border-white/20 shadow-[-20px_0_40px_rgba(163,177,198,0.3)]">
      {/* Header */}
      <div className="p-8 pb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-clay rounded-2xl neumorphic-extruded text-accent">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-clay-dark font-display leading-none mb-1">Telco AI Consultant</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Analysis
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-3 bg-clay rounded-xl neumorphic-extruded hover:text-rose-500 transition-all neumorphic-button-active">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[90%] p-5 rounded-3xl text-sm leading-relaxed font-medium
              ${msg.role === 'user' 
                ? 'bg-clay neumorphic-inset text-clay-dark border-t border-white/40' 
                : 'bg-clay neumorphic-extruded text-clay-dark'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
             <div className="bg-clay p-4 rounded-2xl neumorphic-extruded">
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200"></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-8 pt-0">
        <div className="p-2 rounded-[24px] bg-clay neumorphic-inset-deep">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for strategic advice..."
              className="w-full pl-6 pr-14 py-4 rounded-2xl bg-transparent text-clay-dark font-medium placeholder-clay-muted focus:outline-none"
              disabled={isSending}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="absolute right-2 p-3 bg-accent text-white rounded-xl hover:bg-accent-light disabled:opacity-50 transition-all shadow-lg shadow-accent/20 neumorphic-button-active"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-clay-muted text-center mt-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-accent" />
          Powered by Gemini 3 Pro
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;