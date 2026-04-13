import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Pencil, Trash2, KeyRound, Users, Activity, Shield } from "lucide-react";

export const Route = createFileRoute("/dashboard/admin")({
  component: AdminPage,
});

const users = [
  { name: "Maria Silva", email: "maria@email.com", role: "Aluno", status: "Ativo", lastLogin: "Hoje" },
  { name: "João Pereira", email: "joao@email.com", role: "Aluno", status: "Ativo", lastLogin: "Ontem" },
  { name: "Ana Costa", email: "ana@email.com", role: "Aluno", status: "Inativo", lastLogin: "5 dias" },
  { name: "Pedro Lima", email: "pedro@email.com", role: "Monitor", status: "Ativo", lastLogin: "Hoje" },
];

function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Gerenciamento de usuários e turmas</p>
          </div>
        </div>
        <button className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all">
          <UserPlus className="w-4 h-4" />
          Criar Usuário
        </button>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 animate-scale-in">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-lg font-bold text-card-foreground">156</div>
            <div className="text-xs text-muted-foreground">Usuários totais</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 animate-scale-in">
          <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-success" />
          </div>
          <div>
            <div className="text-lg font-bold text-card-foreground">89</div>
            <div className="text-xs text-muted-foreground">Ativos hoje</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 animate-scale-in">
          <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-warning" />
          </div>
          <div>
            <div className="text-lg font-bold text-card-foreground">8</div>
            <div className="text-xs text-muted-foreground">Turmas ativas</div>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-card-foreground">Usuários</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Nome</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Email</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Papel</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Último Login</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-card-foreground">{user.name}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      user.status === "Ativo" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{user.lastLogin}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
