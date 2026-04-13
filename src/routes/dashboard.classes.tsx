import { createFileRoute } from "@tanstack/react-router";
import { Users, BookOpen, Trophy, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/classes")({
  component: ClassesPage,
});

const classes = [
  { name: "Engenharia de Software", members: 42, materials: 128, code: "ENG401", color: "from-primary to-primary/60" },
  { name: "Cálculo III", members: 38, materials: 95, code: "MAT301", color: "from-success to-success/60" },
  { name: "Física II", members: 35, materials: 72, code: "FIS202", color: "from-warning to-warning/60" },
  { name: "Álgebra Linear", members: 40, materials: 84, code: "MAT201", color: "from-chart-3 to-chart-3/60" },
];

function ClassesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Turmas</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie suas turmas e materiais compartilhados</p>
        </div>
        <button className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all glow-primary">
          <Plus className="w-4 h-4" />
          Nova Turma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <div
            key={cls.code}
            className="rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-scale-in"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cls.color} flex items-center justify-center shrink-0`}>
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground">{cls.name}</h3>
                <span className="text-xs text-muted-foreground">{cls.code}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                {cls.members} membros
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                {cls.materials} materiais
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                <Trophy className="w-3.5 h-3.5" />
                Ranking
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
