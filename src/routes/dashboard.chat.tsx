import { createFileRoute } from "@tanstack/react-router";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/chat")({
  component: ChatPage,
});

const sampleMessages = [
  { role: "assistant" as const, content: "Olá! Sou o assistente StudyMind AI. Como posso te ajudar nos estudos hoje?" },
  { role: "user" as const, content: "Pode me explicar integrais triplas em coordenadas cilíndricas?" },
  { role: "assistant" as const, content: "Claro! Integrais triplas em coordenadas cilíndricas são usadas quando a região de integração tem simetria cilíndrica.\n\nAs coordenadas cilíndricas (r, θ, z) se relacionam com as cartesianas por:\n- x = r·cos(θ)\n- y = r·sin(θ)\n- z = z\n\nO elemento de volume em cilíndricas é: **dV = r · dr · dθ · dz**\n\nO fator \"r\" é o jacobiano da transformação e é essencial! Quer que eu resolva um exemplo passo a passo?" },
];

function ChatPage() {
  const [input, setInput] = useState("");
  const [messages] = useState(sampleMessages);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border animate-slide-up">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Chat IA</h1>
          <p className="text-xs text-muted-foreground">Assistente inteligente de estudos</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-slide-up ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "gradient-primary text-primary-foreground"
                  : "bg-card border border-border text-card-foreground"
              }`}
            >
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-2" : ""}>
                  {line.split("**").map((part, k) =>
                    k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4 pb-2">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte algo sobre seus estudos..."
            className="flex-1 h-11 rounded-xl bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-all glow-primary shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          StudyMind AI pode cometer erros. Verifique informações importantes.
        </p>
      </div>
    </div>
  );
}
