import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, Pencil, Trash2, KeyRound, Users, Activity, Shield, Plus, Layout, Layers } from "lucide-react";
import { courses as initialCourses } from "@/lib/data";

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
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'calendar'>('users');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Gerenciamento global da plataforma</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-lg w-fit">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'users' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Usuários
        </button>
        <button 
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'courses' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Estrutura Acadêmica
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'calendar' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Calendário IA
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Admin stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          {/* Users table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">Gerenciar Usuários</h3>
              <button className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-all">
                <UserPlus className="w-3.5 h-3.5" />
                Novo Usuário
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Nome</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Email</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Papel</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
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
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button className="w-7 h-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive">
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
        </>
      ) : activeTab === 'courses' ? (
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <Layout className="w-4 h-4 text-primary" />
                  Cursos e Períodos
                </h3>
                <button className="h-7 px-3 rounded-md bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-colors">
                  ADICIONAR CURSO
                </button>
              </div>
              <div className="space-y-2">
                {initialCourses.map(course => (
                  <div key={course.id} className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{course.name}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:text-primary"><Pencil className="w-3 h-3" /></button>
                        <button className="p-1 hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {course.periods.map(period => (
                        <span key={period.id} className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full">{period.name}</span>
                      ))}
                      <button className="text-[10px] text-primary hover:underline">+ Período</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-success" />
                  Matérias (Global)
                </h3>
                <button className="h-7 px-3 rounded-md bg-success/10 text-success text-[10px] font-bold hover:bg-success/20 transition-colors">
                  ADICIONAR MATÉRIA
                </button>
              </div>
              <div className="space-y-2">
                {["Anatomia Humana I", "Embriologia", "Cinesiologia I", "Fisiologia Geral"].map(mat => (
                  <div key={mat} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-transparent hover:border-border transition-all">
                    <span className="text-sm">{mat}</span>
                    <button className="p-1 text-muted-foreground hover:text-foreground"><Pencil className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="max-w-md mx-auto text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Sincronização de Calendário via IA</h3>
                  <p className="text-sm text-muted-foreground mt-2">Faça o upload do PDF oficial da instituição para que nossa IA extraia automaticamente as datas de provas e eventos.</p>
                </div>

                <div className="grid gap-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-all hover:border-primary/50 group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-2" />
                      <p className="text-xs text-muted-foreground font-medium">Clique para selecionar o PDF ou arraste</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" disabled={isSyncing} />
                  </label>

                  <button 
                    onClick={async () => {
                      setIsSyncing(true);
                      setSyncStatus("Processando calendário com StudyMind IA...");
                      try {
                        const { adminService } = await import('../services/adminService');
                        await adminService.syncCalendar();
                        setSyncStatus("Calendário sincronizado com sucesso!");
                      } catch (err) {
                        setSyncStatus("Erro ao sincronizar calendário.");
                      } finally {
                        setIsSyncing(false);
                      }
                    }}
                    disabled={isSyncing}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <>
                        <Activity className="w-5 h-5 animate-spin" />
                        SINCRONIZANDO...
                      </>
                    ) : (
                      "INICIAR PROCESSAMENTO IA"
                    )}
                  </button>
                  
                  {syncStatus && (
                    <p className={`text-xs font-bold ${syncStatus.includes('sucesso') ? 'text-success' : 'text-muted-foreground'}`}>
                      {syncStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Instruções de Uso</h4>
              <ul className="space-y-4">
                {[
                  { title: "Formato Suportado", desc: "Apenas arquivos PDF são aceitos para extração." },
                  { title: "Extração Automática", desc: "O sistema detecta datas, nomes de disciplinas e tipos de evento (Prova, Feriado, etc)." },
                  { title: "Redundância", desc: "Cada sincronização atualiza eventos existentes ou cria novos se não encontrados." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{item.title}</h5>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
