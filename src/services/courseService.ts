import { supabase } from '../lib/supabase';

export const courseService = {
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*, periods(*, subjects(*))')
      .order('name');
    if (error) throw error;
    return data;
  },

  async createCourse(name: string) {
    const { data, error } = await supabase
      .from('courses')
      .insert({ name })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createPeriod(course_id: string, name: string, sequence_order: number) {
    const { data, error } = await supabase
      .from('periods')
      .insert({ course_id, name, sequence_order })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createSubject(period_id: string, name: string, description?: string) {
    const { data, error } = await supabase
      .from('subjects')
      .insert({ period_id, name, description })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
