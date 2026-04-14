import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { Upload, FileText, Image, Music, Video, Link2, Search, Filter, BookOpen, Loader2, MoreVertical, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { courseService } from "@/services/courseService";
import { Course } from "@/lib/data";

export const Route = createFileRoute("/dashboard/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData, filesData] = await Promise.all([
        courseService.getCourses(),
        supabase.from('library_items').select('*').order('created_at', { ascending: false })
      ]);
      setCourses(coursesData as unknown as Course[]);
      setFiles(filesData.data || []);
    } catch (error) {
      console.error("Erro ao carregar biblioteca:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Pegar IDs se houver filtro selecionado
      const courseId = selectedCourse !== 'all' ? courses.find(c => c.name === selectedCourse)?.id : null;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: dbError, data: savedItem } = await supabase
        .from('library_items')
        .insert({
          file_name: file.name,
          file_path: filePath,
          user_id: user?.id,
          course_id: courseId,
          metadata: { size: file.size, type: file.type, processed: false }
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Iniciar Processamento IA (RAG)
      console.log("Iniciando processamento IA...");
      await supabase.functions.invoke('process-material', {
        body: { file_id: savedItem.id, action: 'process' }
      });

      alert("Material sincronizado e processado pela StudyMind IA!");
      fetchData();
    } catch (error: any) {
      alert(`Erro no upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const filteredFiles = files.filter(f => 
    (selectedCourse === "all" || courses.find(c => c.id === f.course_id)?.name === selectedCourse)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Biblioteca Inteligente</h1>
          <p className="text-sm text-muted-foreground mt-1">Sua base de conhecimento para a StudyMind IA</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedCourse}
            onChange={(e) => { setSelectedCourse(e.target.value); }}
            className="h-9 px-3 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Todos os Cursos</option>
            {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Upload area */}
      <label className="block">
        <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-12 text-center hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer animate-scale-in group">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            {uploading ? <Sparkles className="w-8 h-8 text-primary animate-pulse" /> : <Upload className="w-8 h-8 text-primary" />}
          </div>
          <h3 className="text-lg font-bold text-foreground italic uppercase tracking-tighter">
            {uploading ? "SINCRO-IA EM CURSO..." : "IMPORTAR PARA MEMÓRIA IA"}
          </h3>
          <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto text-balance font-medium">
            PDFs, Imagens e Documentos serão convertidos em conhecimento inteligente processado via RAG.
          </p>
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </div>
      </label>

      {/* Grid of Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs font-bold text-muted-foreground mt-4 uppercase tracking-widest">Acessando Arquivos no Cloud...</p>
          </div>
        ) : filteredFiles.length > 0 ? filteredFiles.map((file) => (
          <div
            key={file.id}
            className="group relative rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 animate-slide-up"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                 {file.file_name.endsWith('.pdf') ? <FileText className="w-5 h-5 text-primary" /> : <Image className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex flex-col items-end gap-1">
                 {file.metadata?.processed ? (
                   <span className="flex items-center gap-1 text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 animate-pulse uppercase">
                     <Sparkles className="w-2.5 h-2.5" /> IA PRONTO
                   </span>
                 ) : (
                   <span className="flex items-center gap-1 text-[9px] font-black bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border uppercase">
                     PENDENTE
                   </span>
                 )}
                 <span className="text-[9px] font-bold text-muted-foreground italic truncate max-w-[100px]">
                   {courses.find(c => c.id === file.course_id)?.name || "Geral"}
                 </span>
              </div>
            </div>
            
            <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors pr-6">
              {file.file_name}
            </h4>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Tamanho</span>
                <span className="text-[10px] font-black text-foreground">{file.metadata?.size ? `${(file.metadata.size / 1024 / 1024).toFixed(1)} MB` : "KB"}</span>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               {/* Context menu hint */}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-dashed border-border">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Nenhum conhecimento registrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
