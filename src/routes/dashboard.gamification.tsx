import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Flame, Target, Star, Medal, Zap } from "lucide-react";

export const Route = createFileRoute("/dashboard/gamification")({
  component: GamificationPage,
});

const ranking = [
  { name: "Maria S.", xp: 3200, level: 15, position: 1 },
  { name: "João P.", xp: 2900, level: 14, position: 2 },
  { name: "Você", xp: 2450, level: 12, position: 3, isUser: true },
  { name: "Ana C.", xp: 2100, level: 11, position: 4 },
  { name: "Pedro L.", xp: 1850, level: 10, position: 5 },
];

const achievements = [
  { title: "Primeira Semana", desc: "7 dias seguidos estudando", icon: Flame, unlocked: true },
  { title: "Explorador", desc: "Revisou 50 materiais", icon: Star, unlocked: true },
  { title: "Maratonista", desc: "10h de estudo em um dia", icon: Zap, unlocked: false },
  { title: "Mestre", desc: "Chegou ao nível 20", icon: Medal, unlocked: false },
];

function GamificationPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground">Gamificação</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe seu progresso, XP e conquistas</p>
      </div>

      {/* XP Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-xp/20 bg-card p-5 animate-scale-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-xp/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-xp" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">XP Total</span>
          </div>
          <div className="text-3xl font-bold text-card-foreground">2.450</div>
          <div className="mt-2 w-full h-2 rounded-full bg-muted">
            <div className="h-full w-[82%] rounded-full gradient-xp" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">550 XP para o nível 13</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 animate-scale-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Nível Atual</span>
          </div>
          <div className="text-3xl font-bold text-card-foreground">12</div>
          <p className="text-xs text-muted-foreground mt-1">Explorador</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 animate-scale-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
              <Flame className="w-4 h-4 text-success" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Sequência</span>
          </div>
          <div className="text-3xl font-bold text-card-foreground">14 dias</div>
          <p className="text-xs text-muted-foreground mt-1">Recorde: 21 dias</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking */}
        <div className="rounded-xl border border-border bg-card p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-xp" />
            <h3 className="text-sm font-semibold text-card-foreground">Ranking da Turma</h3>
          </div>
          <div className="space-y-2">
            {ranking.map((r) => (
              <div
                key={r.position}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  r.isUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/30"
                }`}
              >
                <span className={`text-sm font-bold w-6 text-center ${r.position <= 3 ? "text-xp" : "text-muted-foreground"}`}>
                  #{r.position}
                </span>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">{r.name[0]}</span>
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${r.isUser ? "text-primary" : "text-card-foreground"}`}>
                    {r.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">Lv.{r.level}</span>
                </div>
                <span className="text-sm font-semibold text-xp">{r.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-xl border border-border bg-card p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-4 h-4 text-xp" />
            <h3 className="text-sm font-semibold text-card-foreground">Conquistas</h3>
          </div>
          <div className="space-y-3">
            {achievements.map((a) => (
              <div
                key={a.title}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  a.unlocked ? "hover:bg-muted/30" : "opacity-40"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  a.unlocked ? "gradient-xp glow-xp" : "bg-muted"
                }`}>
                  <a.icon className={`w-5 h-5 ${a.unlocked ? "text-xp-foreground" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-card-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.desc}</div>
                </div>
                {a.unlocked && <Star className="w-4 h-4 text-xp ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
