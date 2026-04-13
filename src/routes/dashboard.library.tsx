import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileText, Image, Music, Video, Link2, FolderOpen, Search } from "lucide-react";

export const Route = createFileRoute("/dashboard/library")({
  component: LibraryPage,
});

const files = [
  { name: "Resumo Cálculo III.pdf", type: "PDF", size: "2.4 MB", date: "12 Abr", icon: FileText, color: "text-destructive" },
  { name: "Diagrama Ondas.png", type: "Imagem", size: "890 KB", date: "11 Abr", icon: Image, color: "text-success" },
  { name: "Aula 15 — Gravação.mp3", type: "Áudio", size: "45 MB", date: "10 Abr", icon: Music, color: "text-primary" },
  { name: "Projeto Final.mp4", type: "Vídeo", size: "120 MB", date: "9 Abr", icon: Video, color: "text-warning" },
  { name: "Referência Álgebra", type: "Link", size: "—", date: "8 Abr", icon: Link2, color: "text-chart-3" },
];

function LibraryPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground">Biblioteca Inteligente</h1>
        <p className="text-sm text-muted-foreground mt-1">Todos os seus materiais de estudo em um só lugar</p>
      </div>

      {/* Upload area */}
      <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-10 text-center hover:border-primary/50 transition-all cursor-pointer animate-scale-in">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-card-foreground">Arraste e solte arquivos aqui</h3>
        <p className="text-xs text-muted-foreground mt-1">PDFs, imagens, áudios, vídeos, documentos e links</p>
        <button className="mt-4 h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          Selecionar Arquivos
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar materiais..."
          className="w-full h-10 rounded-lg bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {/* Files */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_100px] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground">
          <span>Nome</span>
          <span>Tipo</span>
          <span>Tamanho</span>
          <span>Data</span>
        </div>
        {files.map((file) => (
          <div
            key={file.name}
            className="grid grid-cols-[1fr_100px_100px_100px] gap-4 px-5 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer items-center"
          >
            <div className="flex items-center gap-3 min-w-0">
              <file.icon className={`w-4 h-4 shrink-0 ${file.color}`} />
              <span className="text-sm text-card-foreground truncate">{file.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{file.type}</span>
            <span className="text-xs text-muted-foreground">{file.size}</span>
            <span className="text-xs text-muted-foreground">{file.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
