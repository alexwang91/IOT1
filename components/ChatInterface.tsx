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
        ? `Consultant active. I have full context on ${report.operatorName}'s ${report.country} operations. Ask me about specific technical roadmaps or commercial ROI targets.`
        : `专家顾问已就绪。我已掌握 ${report.operatorName} 在 ${report.country} 的分析数据。您可以询问有关技术演进路径或商业投资回报的具体细节。`,
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
    <div className="flex flex-col h-full bg-white shadow-2xl">
      {/* Chat Header */}
      <div className="p-6 border-b border-border flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/5 rounded-xl flex items-center justify-center text-accent">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm leading-tight">Telco AI Strategy</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Expert Context Active</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/30 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-foreground text-white' : 'bg-accent text-white'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
               </div>
               <div className={`
                 p-4 rounded-2xl text-sm leading-relaxed
                 ${msg.role === 'user' 
                   ? 'bg-foreground text-white' 
                   : 'bg-white border border-border text-foreground shadow-sm'}
               `}>
                 {msg.text}
               </div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start gap-3">
             <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
             </div>
             <div className="bg-white border border-border p-4 rounded-2xl flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.4s]" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-border bg-white">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query strategic specifics..."
            className="w-full pl-5 pr-14 py-4 rounded-xl bg-muted/50 border border-border focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-medium text-sm"
            disabled={isSending}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-accent text-white rounded-lg hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50 transition-all active:scale-90"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">
           <Sparkles className="w-3 h-3 text-accent" />
           Gemini 3 Pro Intelligence
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;