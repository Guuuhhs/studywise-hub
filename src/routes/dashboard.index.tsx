import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { supabase } from "@/lib/supabase";
import {
  BookOpen,
  Clock,
  Target,
  Trophy,
  Flame,
  CalendarDays,
  FileText,
  TrendingUp,
  Layers,
  Loader2,
  Sparkles,
  Brain,
  History
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const [stats, setStats] = useState({ courses: 0, files: 0, exams: 0 });
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [courses, files, upcomingExams] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase.from('library_items').select('id', { count: 'exact' }),
        supabase.from('academic_events').select('*').eq('event_type', 'exam').order('start_date')
      ]);

      setStats({
        courses: courses.count || 0,
        files: files.count || 0,
        exams: upcomingExams.data?.length || 0
      });
      setExams(upcomingExams.data || []);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const studyHours = [3.5, 2, 4, 1.5, 5, 3, 0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bem-vindo(a) ao StudyMind AI! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Status do seu ecossistema acadêmico conectado ao Supabase.
          </p>
        </div>
        {loading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-scale-in">
        <div className="lg:col-span-2 rounded-xl gradient-primary p-5 glow-primary flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium text-primary-foreground/80">StudyMind Intelligence Core</div>
              <div className="text-xl font-bold text-primary-foreground">RAG & Memória Ativos</div>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/60">IA Contextual</span>
             <div className="flex -space-x-2 mt-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-primary-foreground/10 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    <Brain className="w-4 h-4" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 group hover:border-primary/50 transition-all cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <History className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-success uppercase tracking-wider">Próxima Revisão</div>
              <div className="text-sm font-bold text-foreground">Sistema Olfativo</div>
              <div className="text-[9px] text-muted-foreground italic">Recomendado pela IA</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Horas Estudadas"
          value="19.5h"
          subtitle="Mockup Estático"
          icon={Clock}
          variant="primary"
        />
        <StatCard
          title="Provas Próximas"
          value={stats.exams.toString()}
          subtitle="Do Banco de Dados"
          icon={Target}
          variant="warning"
        />
        <StatCard
          title="Memória IA"
          value={stats.files.toString()}
          subtitle="Materiais Processados"
          icon={Brain}
          variant="success"
        />
        <StatCard
          title="XP Acadêmico"
          value="2.450"
          subtitle="Ganhos hoje"
          icon={Trophy}
          variant="xp"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">Frequência de Estudo</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 7 dias</p>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weekDays.map((day, i) => {
              const height = studyHours[i] > 0 ? (studyHours[i] / 5) * 100 : 4;
              const isToday = i === new Date().getDay() - 1;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative flex items-end" style={{ height: "120px" }}>
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${
                        isToday ? "gradient-primary glow-primary" : "bg-primary/20"
                      }`}
                      style={{ height: `${height}%`, minHeight: "4px" }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">Agenda de Provas</h3>
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-3">
            {exams.length > 0 ? exams.slice(0, 4).map((exam) => (
              <div key={exam.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="px-2 py-1 rounded-md text-[9px] font-bold bg-destructive/10 text-destructive uppercase">PROVA</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-card-foreground truncate">{exam.title}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(exam.start_date).toLocaleDateString()}</div>
                </div>
              </div>
            )) : (
              <p className="text-xs text-muted-foreground text-center py-4">Nenhuma prova agendada no banco.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
