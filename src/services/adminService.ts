import { supabase } from '../lib/supabase';

export const adminService = {
  async createUser(email: string, fullName: string, role: string, courseId?: string) {
    // Note: Admin user creation usually happens via Edge Function to bypass public signup restriction
    const { data, error } = await supabase.functions.invoke('auth-admin', {
      body: { action: 'create_user', email, fullName, role, courseId }
    });
    
    if (error) throw error;
    
    // Log action
    await this.logAction('CREATE_USER', { email, role });
    
    return data;
  },

  async resetPassword(userId: string) {
    const { data, error } = await supabase.functions.invoke('auth-admin', {
      body: { action: 'reset_password', userId }
    });
    if (error) throw error;
    return data;
  },

  async logAction(action: string, details: any) {
    const { error } = await supabase
      .from('admin_logs')
      .insert({ 
        action, 
        details,
        admin_id: (await supabase.auth.getUser()).data.user?.id
      });
    if (error) console.error("Failed to log admin action:", error);
  },

  async syncCalendar(file?: File) {
    // In a real scenario, this would upload to Storage and then trigger an Edge Function
    // for PDF parsing using an LLM (like Gemini or OpenAI)
    console.log("Syncing calendar...", file?.name);
    
    // Simulate a delay for "IA Processing"
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockEvents = [
      { title: "Início do Semestre 2026.1", event_type: "semester_start", start_date: "2026-02-02T08:00:00Z", description: "Leitura automática via StudyMind IA" },
      { title: "Prova N1 - Anatomia", event_type: "exam", start_date: "2026-04-18T10:00:00Z", description: "Detectado no calendário PDF" },
      { title: "Prova N1 - Fisiologia", event_type: "exam", start_date: "2026-04-22T19:00:00Z", description: "Detectado no calendário PDF" },
      { title: "Entrega Trabalho NI", event_type: "work", start_date: "2026-04-28T23:59:00Z", description: "Detectado no calendário PDF" },
      { title: "Feriado Acadêmico", event_type: "holiday", start_date: "2026-05-01T00:00:00Z", description: "Detectado no calendário PDF" }
    ];

    const { error } = await supabase.from('academic_events').upsert(mockEvents, { onConflict: 'title,start_date' });
    
    if (error) throw error;

    await this.logAction('SYNC_CALENDAR', { fileName: file?.name || 'manual_sync' });
    return { success: true, count: mockEvents.length };
  }
};
