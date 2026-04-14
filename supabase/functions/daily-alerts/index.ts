import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.10.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch upcoming events (next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const { data: events, error: eventsError } = await supabaseClient
      .from('academic_events')
      .select('*, courses(name)')
      .gte('start_date', new Date().toISOString())
      .lte('start_date', sevenDaysFromNow.toISOString())

    if (eventsError) throw eventsError

    // 2. Fetch all users (for global alerts) or specific interested users
    // For this simulation/demo, we'll notify all users about upcoming academic events
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, full_name, role')

    if (profilesError) throw profilesError

    const notifications = []

    for (const event of events) {
      const eventDate = new Date(event.start_date)
      const diffTime = Math.abs(eventDate.getTime() - new Date().getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let message = ''
      let title = ''

      if (event.event_type === 'exam') {
        title = '🚨 Alerta de Prova!'
        message = `A prova de ${event.title} está chegando! Faltam apenas ${diffDays} dia(s).`
      } else if (event.event_type === 'review') {
        title = '📚 Hora de Revisar'
        message = `Revisão agendada para ${event.title} amanhã. Prepare seus materiais!`
      } else {
        title = '📅 Lembrete de Evento'
        message = `Não se esqueça: ${event.title} será em ${diffDays} dia(s).`
      }

      // Create internal notifications for relevant users
      // (Simplified: everyone for demo, but can be filtered by course_id)
      for (const profile of profiles) {
         notifications.push({
           user_id: profile.id,
           title,
           message,
           type: event.event_type === 'exam' ? 'alert' : 'reminder',
           metadata: { event_id: event.id }
         })
      }
    }

    if (notifications.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('notifications')
        .insert(notifications)
      if (insertError) throw insertError
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed_events: events.length,
      notifications_sent: notifications.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
