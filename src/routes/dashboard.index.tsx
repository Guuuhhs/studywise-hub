import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "@/components/StatCard";
import {
  BookOpen,
  Clock,
  Target,
  Trophy,
  Flame,
  CalendarDays,
  FileText,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

const upcomingExams = [
  { subject: "Cálculo III", date: "17 Abr", type: "Prova", color: "bg-destructive/10 text-destructive" },
  { subject: "Física II", date: "21 Abr", type: "Prova", color: "bg-warning/10 text-warning" },
  { subject: "Programação", date: "24 Abr", type: "Trabalho", color: "bg-primary/10 text-primary" },
  { subject: "Álgebra Linear", date: "28 Abr", type: "Prova", color: "bg-success/10 text-success" },
];

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const studyHours = [3.5, 2, 4, 1.5, 5, 3, 0];

function DashboardIndex() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground">
          Bom dia, Aluno! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Continue sua jornada de estudos. Você está no caminho certo!
        </p>
      </div>

      {/* XP Banner */}
      <div className="rounded-xl gradient-primary p-5 glow-primary animate-scale-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium text-primary-foreground/80">Nível 12 — Explorador</div>
              <div className="text-xl font-bold text-primary-foreground">2.450 XP</div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-primary-foreground/80">Próximo nível</div>
            <div className="text-sm text-primary-foreground">550 XP restantes</div>
            <div className="mt-2 w-32 h-2 rounded-full bg-primary-foreground/20">
              <div className="h-full w-[82%] rounded-full bg-primary-foreground/90 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Horas Estudadas"
          value="19.5h"
          subtitle="Esta semana"
          icon={Clock}
          trend={{ value: "12%", positive: true }}
          variant="primary"
        />
        <StatCard
          title="Provas Próximas"
          value="4"
          subtitle="Nos próximos 15 dias"
          icon={Target}
          variant="warning"
        />
        <StatCard
          title="Materiais Revisados"
          value="23"
          subtitle="Este mês"
          icon={BookOpen}
          trend={{ value: "8%", positive: true }}
          variant="success"
        />
        <StatCard
          title="Ranking"
          value="#3"
          subtitle="Na turma de Engenharia"
          icon={Trophy}
          variant="xp"
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly progress chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">Progresso Semanal</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Horas de estudo por dia</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3" />
              +12% vs semana anterior
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weekDays.map((day, i) => {
              const height = studyHours[i] > 0 ? (studyHours[i] / 5) * 100 : 4;
              const isToday = i === 4;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {studyHours[i]}h
                  </span>
                  <div className="w-full relative flex items-end" style={{ height: "120px" }}>
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${
                        isToday ? "gradient-primary glow-primary" : "bg-primary/20"
                      }`}
                      style={{ height: `${height}%`, minHeight: "4px" }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      isToday ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming exams */}
        <div className="rounded-xl border border-border bg-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">Próximas Provas</h3>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {upcomingExams.map((exam) => (
              <div
                key={exam.subject}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`px-2 py-1 rounded-md text-[10px] font-semibold ${exam.color}`}>
                  {exam.type}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-card-foreground truncate">{exam.subject}</div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{exam.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card p-5 animate-slide-up">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {[
            { action: "Completou flashcards", detail: "Cálculo III — Integrais Triplas", time: "2h atrás", icon: FileText },
            { action: "Enviou resumo", detail: "Física II — Ondas Eletromagnéticas", time: "5h atrás", icon: BookOpen },
            { action: "Subiu no ranking", detail: "#5 → #3 na turma de Engenharia", time: "1 dia atrás", icon: Trophy },
          ].map((item) => (
            <div
              key={item.action}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-card-foreground">{item.action}</div>
                <div className="text-xs text-muted-foreground truncate">{item.detail}</div>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
