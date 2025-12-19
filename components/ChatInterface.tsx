
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FWAReport, Language } from '../types';
import { chatWithInsight } from '../services/geminiService';
import { Send, X, Bot, Sparkles, User } from 'lucide-react';

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
        ? `CONSULTANT_ACTIVE. TARGET: ${report.operatorName.toUpperCase()}. ASK FOR ARCHITECTURAL DRILL-DOWN OR ROI LOGIC.`
        : `专家顾问已就绪。目标：${report.operatorName.toUpperCase()}。您可以询问架构演进或投资回报逻辑。`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
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
    <div className="flex flex-col h-full bg-white border-l-8 border-primary">
      {/* Chat Header */}
      <div className="p-8 border-b-4 border-foreground flex justify-between items-center bg-white">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-primary flex items-center justify-center text-white rounded-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-foreground text-xl leading-none uppercase tracking-tighter italic">Strategic AI</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-secondary" />
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground/40">Grounded Insight Mode</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-sm transition-all hover:scale-110">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-muted/30 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-10 h-10 rounded-sm shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-foreground text-white' : 'bg-primary text-white'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
               </div>
               <div className={`
                 p-6 rounded-sm text-base font-bold leading-tight
                 ${msg.role === 'user' 
                   ? 'bg-foreground text-white' 
                   : 'bg-white border-2 border-foreground text-foreground'}
               `}>
                 {msg.text}
               </div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start gap-4">
             <div className="w-10 h-10 rounded-sm bg-primary text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
             </div>
             <div className="bg-white border-2 border-foreground p-6 rounded-sm flex gap-2">
                <div className="w-2 h-2 bg-primary animate-bounce" />
                <div className="w-2 h-2 bg-primary animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-primary animate-bounce [animation-delay:0.2s]" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-8 border-t-4 border-foreground bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="TYPE_QUERY_HERE..."
            className="w-full pl-6 pr-16 h-16 rounded-md bg-muted border-0 text-foreground font-black text-sm uppercase focus:ring-4 focus:ring-primary focus:outline-none transition-all placeholder:text-foreground/20"
            disabled={isSending}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-sm flex items-center justify-center hover:scale-110 active:scale-90 transition-all disabled:opacity-20 disabled:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 text-[10px] font-mono font-black uppercase tracking-[0.4em] text-foreground/20 italic">
           <Sparkles className="w-4 h-4 text-primary" />
           GEMINI_PRO_THINKING_ACTIVE
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
