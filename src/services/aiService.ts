import { supabase } from '../lib/supabase';

export interface AIChatOptions {
  mode: 'explain' | 'summarize' | 'quiz' | 'flashcard' | 'schedule';
  contextIds?: string[];
}

export const aiService = {
  async searchContext(query: string, matchCount: number = 5) {
    // 1. Generate embedding for query (In real app, call a function/API)
    // Here we simulate the embedding generation
    const mockQueryEmbedding = Array.from({ length: 1536 }, () => Math.random());

    // 2. Call similarity search RPC
    const { data: chunks, error } = await supabase.rpc('match_document_chunks', {
      query_embedding: mockQueryEmbedding,
      match_threshold: 0.1,
      match_count: matchCount
    });

    if (error) {
      console.error("Match error:", error);
      return [];
    }
    return chunks;
  },

  async askIA(prompt: string, options: AIChatOptions) {
    // 1. Retrieve Context
    const contextChunks = await this.searchContext(prompt);
    const contextText = contextChunks.map((c: any) => c.content).join('\n---\n');

    // 2. Build Intelligent Prompt
    const systemPrompt = `Você é a StudyMind IA, um assistente de estudos contextual.
    Sempre use o contexto abaixo para fundamentar suas respostas.
    Se não houver contexto útil, avise ao usuário mas tente ajudar com conhecimentos gerais.
    
    MODO: ${options.mode}
    CONTEXTO EXTRAÍDO DOS MATERIAIS:
    ${contextText}
    `;

    // 3. Call Chat Function (Simulated response for now)
    // In a real scenario, this calls supabase.functions.invoke('chat') or Gemini API
    console.log("System Prompt built with context from", contextChunks.length, "chunks");

    // Simulated latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple mock logic for different modes
    if (options.mode === 'summarize') {
       return { 
         text: `Aqui está o resumo dos seus materiais:\n\n1. O fêmur é o osso mais longo do corpo.\n2. Músculos esqueléticos geram movimento voluntário.\n\nTópicos principais: Anatomia e Fisiologia Locomotora.`,
         contextUsed: contextChunks.length > 0
       };
    }

    if (options.mode === 'quiz') {
      return {
        text: `Vamos testar seu conhecimento!\n\nPergunta 1: Qual é o osso mais longo do corpo humano?\nA) Úmero\nB) Fêmur\nC) Tíbia\n\nResponda para continuar!`,
        contextUsed: true
      };
    }

    return {
      text: `Entendi sua dúvida sobre "${prompt}". De acordo com seus materiais, o fêmur é essencial para a estrutura de sustentação e os músculos esqueléticos são os motores do corpo.`,
      contextUsed: contextChunks.length > 0
    };
  },

  async recordMemory(fact: string, category: string = 'general') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const mockEmbedding = Array.from({ length: 1536 }, () => Math.random());

    await supabase.from('user_memory').insert({
      user_id: user.id,
      fact,
      category,
      embedding: mockEmbedding
    });
  }
};
