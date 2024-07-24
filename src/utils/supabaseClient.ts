import { createClient } from '@supabase/supabase-js';
import { Project } from 'next/dist/build/swc';

const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// @ts-ignore
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProjectType {
    id?: number;
    title: string;
    description: string;
    logoUrl: string;
}

export const insertData = async (data: ProjectType) => {
    await supabase
        .from('test_projects')
        .insert(data)
        .select()
        .then((res: any) => {
          return res
    });
}

export const upsertData = async (data: ProjectType[]) => {
    // Handle submission logic here
    await supabase
      .from('test_projects')
      .upsert(data)
      .select()
      .then((res) => {
        console.log("Res", res)
    });
};

export const readAllData = async () => {
    try {
      const { data, error } = await supabase.from('test_projects').select('*');
      if (error) {
        throw error;
      }
      if (data) {
        return data
      }
    } catch (error) {
      return ('Error reading data:' + error);
    }
};

export const readOneData = async (project_id:number) => {
    try {
      const { data, error } = await supabase.from('test_projects').select('*').eq('id', project_id);
      if (error) {
        throw error;
      }
      if (data) {
        return data;
      }
    } catch (error) {
      return('Error reading data:' + error);
    }
};

export const deleteData = async (id: number) => {
    await supabase
    .from('test_projects')
    .delete()
    .eq('id', id)
};