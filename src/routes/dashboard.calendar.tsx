import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/calendar")({
  component: CalendarPage,
});

const events = [
  { day: 17, title: "Prova Cálculo III", type: "exam" },
  { day: 21, title: "Prova Física II", type: "exam" },
  { day: 24, title: "Entrega Projeto", type: "work" },
  { day: 14, title: "Revisão Álgebra", type: "review" },
  { day: 28, title: "Prova Álgebra", type: "exam" },
];

const typeColors: Record<string, string> = {
  exam: "bg-destructive/20 text-destructive",
  work: "bg-primary/20 text-primary",
  review: "bg-success/20 text-success",
};

function CalendarPage() {
  const daysInMonth = 30;
  const firstDayOffset = 1;
  const today = 13;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground">Calendário</h1>
        <p className="text-sm text-muted-foreground mt-1">Provas, revisões e eventos programados</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold text-card-foreground">Abril 2026</h2>
          <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === today;
            const dayEvents = events.filter((e) => e.day === day);
            return (
              <div
                key={day}
                className={`relative min-h-[72px] p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isToday
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted/30"
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isToday ? "text-primary" : "text-card-foreground"
                  }`}
                >
                  {day}
                </span>
                {dayEvents.map((ev) => (
                  <div
                    key={ev.title}
                    className={`mt-1 text-[9px] font-medium px-1.5 py-0.5 rounded truncate ${typeColors[ev.type]}`}
                  >
                    {ev.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-destructive/60" /> Prova</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary/60" /> Trabalho</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success/60" /> Revisão</div>
      </div>
    </div>
  );
}
