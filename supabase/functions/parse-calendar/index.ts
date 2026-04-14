import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { file_path, course_id } = await req.json()

  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // 1. Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('study-materials')
      .download(file_path)

    if (downloadError) throw downloadError

    // 2. OCR / PDF Parsing (Logic would go here using an AI SDK)
    // For this example, we'll mock the extraction of dates
    console.log("Parsing file:", file_path)
    
    // MOCK DATA extracted from PDF
    const mockEvents = [
      { title: "Início do Semestre", event_type: "semester_start", start_date: "2026-02-02" },
      { title: "Prova N1 - Bloco A", event_type: "exam", start_date: "2026-04-10" },
      { title: "Feriado Tiradentes", event_type: "holiday", start_date: "2026-04-21" },
    ]

    // 3. Save to database
    const { error: insertError } = await supabase
      .from('academic_events')
      .insert(mockEvents.map(e => ({ ...e, course_id })))

    if (insertError) throw insertError

    return new Response(JSON.stringify({ success: true, events_count: mockEvents.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
