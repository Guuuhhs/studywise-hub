import { createFileRoute } from "@tanstack/react-router";
import { Plus, FileText, CheckSquare, Table2, Image, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/dashboard/study")({
  component: StudyPage,
});

const pages = [
  { title: "Resumo Cálculo III — Integrais", updated: "Hoje", blocks: 24 },
  { title: "Ondas Eletromagnéticas — Notas", updated: "Ontem", blocks: 18 },
  { title: "Álgebra Linear — Autovalores", updated: "3 dias", blocks: 32 },
  { title: "Programação — Design Patterns", updated: "1 semana", blocks: 15 },
];

const blockTypes = [
  { icon: FileText, label: "Texto" },
  { icon: CheckSquare, label: "Checklist" },
  { icon: Table2, label: "Tabela" },
  { icon: Image, label: "Imagem" },
  { icon: RotateCcw, label: "Flashcard" },
];

function StudyPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Páginas de Estudo</h1>
          <p className="text-sm text-muted-foreground mt-1">Editor de notas estilo Notion com blocos inteligentes</p>
        </div>
        <button className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all glow-primary">
          <Plus className="w-4 h-4" />
          Nova Página
        </button>
      </div>

      {/* Block types */}
      <div className="flex items-center gap-2 animate-slide-up">
        {blockTypes.map((block) => (
          <button
            key={block.label}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <block.icon className="w-3.5 h-3.5" />
            {block.label}
          </button>
        ))}
      </div>

      {/* Pages list */}
      <div className="space-y-2">
        {pages.map((page) => (
          <div
            key={page.title}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-scale-in"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-card-foreground truncate">{page.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{page.blocks} blocos • Atualizado {page.updated}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
