import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { BookOpen, Plus, ChevronRight, Layers, Layout, ChevronLeft, Loader2 } from "lucide-react";
import { courseService } from "@/services/courseService";
import { Course, Period, Subject } from "@/lib/data";

export const Route = createFileRoute("/dashboard/classes")({
  component: CoursesPage,
});

function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [view, setView] = useState<{ type: 'courses' | 'periods' | 'subjects', id?: string, parentId?: string }>({ type: 'courses' });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data as unknown as Course[]);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      alert("Erro de conexão com o Supabase. Verifique a chave no console.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      setLoading(true);
      if (view.type === 'courses') {
        await courseService.createCourse(newName);
      } else if (view.type === 'periods' && view.id) {
        await courseService.createPeriod(view.id, newName, (courses.find(c => c.id === view.id)?.periods?.length || 0) + 1);
      } else if (view.type === 'subjects' && view.id) {
        await courseService.createSubject(view.id, newName);
      }
      setNewName("");
      setIsAdding(false);
      await loadCourses();
    } catch (error) {
      console.error("Erro ao criar item:", error);
      alert("Erro ao salvar dados.");
    } finally {
      setLoading(false);
    }
  };

  const currentCourse = view.type !== 'courses' ? courses.find(c => c.id === (view.type === 'periods' ? view.id : view.parentId)) : null;
  const currentPeriod = view.type === 'subjects' ? currentCourse?.periods.find(p => p.id === view.id) : null;

  if (loading && view.type === 'courses' && courses.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          {view.type !== 'courses' && (
            <button 
              onClick={() => { setView(view.type === 'subjects' ? { type: 'periods', id: view.parentId } : { type: 'courses' }); setIsAdding(false); }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {view.type === 'courses' ? "Cursos" : 
               view.type === 'periods' ? `Períodos — ${currentCourse?.name}` : 
               `Matérias — ${currentPeriod?.name}`}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {view.type === 'courses' ? "Gerencie seus cursos de graduação" :
               view.type === 'periods' ? `Semestres de ${currentCourse?.name}` :
               `Disciplinas de ${currentPeriod?.name}`}
            </p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all glow-primary"
          >
            <Plus className="w-4 h-4" />
            {view.type === 'courses' ? "Novo Curso" : view.type === 'periods' ? "Novo Período" : "Nova Matéria"}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-card border border-primary/30 p-4 rounded-xl animate-scale-in flex flex-col sm:flex-row gap-3">
          <input 
            autoFocus
            type="text"
            placeholder={`Nome do(a) ${view.type === 'courses' ? 'curso' : view.type === 'periods' ? 'período' : 'matéria'}`}
            className="flex-1 h-10 px-4 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="flex gap-2">
            <button 
              onClick={handleCreate}
              className="h-10 px-6 rounded-lg gradient-primary text-primary-foreground text-sm font-bold"
            >
              Salvar
            </button>
            <button 
              onClick={() => { setIsAdding(false); setNewName(""); }}
              className="h-10 px-4 rounded-lg bg-muted text-muted-foreground text-sm hover:text-foreground"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {view.type === 'courses' && courses.map((course) => (
          <div
            key={course.id}
            onClick={() => setView({ type: 'periods', id: course.id })}
            className="rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-scale-in group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <Layout className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{course.name}</h3>
                <span className="text-xs text-muted-foreground">{course.periods?.length || 0} períodos registrados</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}

        {view.type === 'periods' && currentCourse?.periods?.map((period) => (
          <div
            key={period.id}
            onClick={() => setView({ type: 'subjects', id: period.id, parentId: currentCourse.id })}
            className="rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-scale-in group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground group-hover:text-success transition-colors">{period.name}</h3>
                <span className="text-xs text-muted-foreground">{period.subjects?.length || 0} matérias</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}

        {view.type === 'subjects' && currentPeriod?.subjects?.map((subject) => (
          <div
            key={subject.id}
            className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-all duration-200 animate-scale-in"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground">{subject.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    subject.status === 'em_andamento' ? "bg-warning/10 text-warning" :
                    subject.status === 'concluido' ? "bg-success/10 text-success" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {subject.status === 'em_andamento' ? "Em andamento" :
                     subject.status === 'concluido' ? "Concluído" : "Planejado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {((view.type === 'courses' && courses.length === 0) ||
          (view.type === 'periods' && currentCourse?.periods?.length === 0) ||
          (view.type === 'subjects' && currentPeriod?.subjects?.length === 0)) && !loading && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">Nenhum item encontrado. Clique em "Novo" para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
