import { createFileRoute } from "@tanstack/react-router";
import { Settings, User, Bell, Palette, Lock } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie suas preferências e conta</p>
      </div>

      {[
        { icon: User, title: "Perfil", desc: "Nome, avatar e informações pessoais" },
        { icon: Bell, title: "Notificações", desc: "Alertas de provas, revisões e mensagens" },
        { icon: Palette, title: "Aparência", desc: "Tema, cores e personalização" },
        { icon: Lock, title: "Segurança", desc: "Senha e autenticação" },
      ].map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-scale-in"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <item.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
