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

    const { file_id, action } = await req.json()

    if (action === 'process') {
      // 1. Get file info
      const { data: item, error: itemError } = await supabaseClient
        .from('library_items')
        .select('*')
        .eq('id', file_id)
        .single()

      if (itemError) throw itemError

      // 2. Simulate IA Extraction & OCR
      // In a real scenario, we would use Gemini Vision or a PDF Parser here
      console.log(`Processing ${item.file_name}...`)
      
      const extractedContent = `Conteúdo extraído do arquivo ${item.file_name}.
      Este documento discute tópicos importantes de anatomia humana, focando no sistema esquelético e muscular.
      O fêmur é o osso mais longo do corpo humano. Os músculos esqueléticos são responsáveis pelo movimento voluntário.`
      
      // 3. Chunking (Simulated)
      const chunks = extractedContent.split('. ').map(c => c.trim()).filter(c => c.length > 0)
      
      // 4. Generating Embeddings (Simulated - in real app use OpenAI/Gemini/Transformers.js)
      // For this demo, we'll use a dummy vector or a real embedding service if available
      for (const chunk of chunks) {
        // Mock embedding (1536 dim)
        const mockEmbedding = Array.from({ length: 1536 }, () => Math.random())

        await supabaseClient.from('document_chunks').insert({
          document_id: file_id,
          content: chunk,
          embedding: mockEmbedding
        })
      }

      // 5. Update main item
      await supabaseClient.from('library_items').update({
        content_text: extractedContent,
        metadata: { processed: true, chunks_count: chunks.length }
      }).eq('id', file_id)

      return new Response(JSON.stringify({ success: true, message: 'Processamento concluído via IA' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: 'Ação desconhecida' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
