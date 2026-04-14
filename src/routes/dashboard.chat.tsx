import { createFileRoute } from "@tanstack/react-router";
import { Send, Bot, User, Sparkles, Brain, BookOpen, GraduationCap, Calendar, History, Loader2, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { aiService, AIChatOptions } from "@/services/aiService";

export const Route = createFileRoute("/dashboard/chat")({
  component: ChatPage,
});

type Message = {
  role: "assistant" | "user";
  content: string;
  isContextual?: boolean;
};

function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Olá! Sou o assistente StudyMind AI. Como posso te ajudar nos estudos hoje? Você pode me enviar materiais ou perguntar sobre o que já estudamos." }
  ]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AIChatOptions['mode']>('explain');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await aiService.askIA(userMessage, { mode });
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response.text,
        isContextual: response.contextUsed 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Ops, tive um problema ao processar sua dúvida. Pode tentar de novo?" }]);
    } finally {
      setLoading(false);
    }
  };

  const modes = [
    { id: 'explain', label: 'Explicar', icon: GraduationCap, color: 'text-primary' },
    { id: 'summarize', label: 'Resumir', icon: BookOpen, color: 'text-success' },
    { id: 'quiz', label: 'Quiz', icon: Brain, color: 'text-warning' },
    { id: 'flashcard', label: 'Flashcards', icon: History, color: 'text-destructive' },
    { id: 'schedule', label: 'Cronograma', icon: Calendar, color: 'text-info' },
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">StudyMind IA</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Sempre contextualizada com seus materiais
            </p>
          </div>
        </div>

        {/* Selection de Modo */}
        <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all border shrink-0 ${
                  mode === m.id 
                    ? "bg-primary/10 border-primary text-primary shadow-sm" 
                    : "bg-card border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 space-y-6 scroll-smooth pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-slide-up ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1 border border-primary/20">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className="max-w-[80%] space-y-1">
              <div
                className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-card border border-border text-card-foreground"
                }`}
              >
                {msg.content.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-2" : ""}>
                    {line.split("**").map((part, k) =>
                      k % 2 === 1 ? <strong key={k} className="text-primary-foreground/90">{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
              
              {msg.isContextual && (
                <div className="flex items-center gap-1 text-[9px] font-bold text-success uppercase tracking-widest px-2 group cursor-help">
                  <Brain className="w-3 h-3" />
                  Conhecimento extraído da sua biblioteca
                  <Info className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Consultando memória...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4 bg-background pb-2">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-3"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={loading ? "StudyMind está pensando..." : "Pergunte algo ou peça um resumo..."}
            className="flex-1 h-12 rounded-xl bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 shrink-0 disabled:opacity-50 disabled:grayscale"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground text-center mt-3 font-medium uppercase tracking-tight">
          SISTEMA RAG ATIVO • CONTEXTO INTELIGENTE ATIVADO
        </p>
      </div>
    </div>
  );
}
