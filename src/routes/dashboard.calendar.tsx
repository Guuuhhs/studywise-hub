import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/calendar")({
  component: CalendarPage,
});

const typeColors: Record<string, string> = {
  exam: "bg-destructive/20 text-destructive",
  work: "bg-primary/20 text-primary",
  review: "bg-success/20 text-success",
  holiday: "bg-muted text-muted-foreground",
  semester_start: "bg-warning/20 text-warning",
  semester_end: "bg-warning/20 text-warning",
  warning: "bg-warning/10 text-warning",
};

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // Começa em Abril 2026
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('academic_events').select('*');
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Cálculos dinâmicos do mês
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Ajuste para Segunda=0: (getDay() + 6) % 7
  const firstDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const monthEvents = events.filter(e => {
    const d = new Date(e.start_date);
    return d.getUTCMonth() === month && d.getUTCFullYear() === year;
  }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  const today = new Date();
  const isSelectedMonthToday = today.getMonth() === month && today.getFullYear() === year;

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div className="animate-slide-up flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendário Acadêmico</h1>
          <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-bold text-balance">Oficial FacUnicamps {year}</p>
        </div>
        {loading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendário Principal */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/5 animate-scale-in">
          <div className="flex items-center justify-between mb-8">
            <button onClick={prevMonth} className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all border border-border">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-card-foreground capitalize">{monthName} {year}</h2>
            <button onClick={nextMonth} className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all border border-border">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
              <div key={d} className="text-center text-[10px] font-black text-muted-foreground py-2 uppercase tracking-widest">{d}</div>
            ))}
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px]" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = isSelectedMonthToday && day === today.getDate();
              
              const dayEvents = monthEvents.filter((e) => new Date(e.start_date).getUTCDate() === day);

              return (
                <div
                  key={day}
                  className={`relative min-h-[100px] p-2 rounded-xl border transition-all duration-300 ${
                    isToday
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/30 hover:border-primary/30 hover:bg-muted/20"
                  }`}
                >
                  <span className={`text-xs font-black ${isToday ? "text-primary" : "text-muted-foreground/60"}`}>
                    {day < 10 ? `0${day}` : day}
                  </span>
                  <div className="space-y-1 mt-2">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`w-full h-1.5 rounded-full shadow-sm ${typeColors[ev.event_type] || "bg-muted"}`}
                        title={ev.title}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel Lateral de Legenda e Detalhes (Estilo PDF) */}
        <div className="lg:col-span-1 space-y-6 animate-slide-up">
          <div className="rounded-2xl border border-border bg-card p-5 h-full overflow-y-auto max-h-[700px] shadow-xl">
            <h3 className="text-sm font-black text-primary uppercase tracking-tighter mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Eventos de {monthName}
            </h3>
            
            <div className="space-y-4">
              {monthEvents.length > 0 ? monthEvents.map((ev) => (
                <div key={ev.id} className="group border-b border-border/50 pb-3 last:border-0">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-foreground leading-none">
                        {new Date(ev.start_date).getUTCDate() < 10 ? `0${new Date(ev.start_date).getUTCDate()}` : new Date(ev.start_date).getUTCDate()}
                      </span>
                      <div className={`w-1 h-full mt-1 rounded-full ${typeColors[ev.event_type] || "bg-muted"}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight">{ev.title}</h4>
                      {ev.description && <p className="text-[10px] text-muted-foreground mt-1 italic">{ev.description}</p>}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-xs text-muted-foreground px-4">Nenhum evento acadêmico registrado para este mês.</p>
                </div>
              )}
            </div>

            {/* Legenda de Cores */}
            <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" /> Prova
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-primary/60" /> Trabalho
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-success/60" /> Revisão
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-warning/60" /> Semestre
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
