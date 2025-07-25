import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interfaces para os dados do Supabase
export interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image: string | null;
  status: 'active' | 'development';
  link: string | null;
  tags: string[];
  order_position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Recruitment {
  id: string;
  nome_completo: string;
  idade: string;
  localidade: string;
  discord: string;
  email: string;
  area_interesse: string[];
  outro_interesse?: string;
  experiencia: string;
  motivacao: string;
  relacao_gaming: string;
  portfolio?: string;
  ferramentas: string;
  experiencia_colaborativa: string;
  experiencia_colaborativa_texto?: string;
  horas_semanais: string;
  modelo_colaboracao: string;
  aceita_politicas: boolean;
  habilidade_principal: string;
  area_aprender?: string;
  comentario_final?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

// Hook para gerenciar banners
export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanners((data || []) as Banner[]);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const addBanner = async (banner: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert(banner)
        .select()
        .single();

      if (error) throw error;
      setBanners(prev => [data as Banner, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding banner:', error);
      throw error;
    }
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setBanners(prev => prev.map(banner => 
        banner.id === id ? data as Banner : banner
      ));
      return data;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBanners(prev => prev.filter(banner => banner.id !== id));
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  };

  return {
    banners,
    isLoading,
    addBanner,
    updateBanner,
    deleteBanner,
    refetch: fetchBanners
  };
};

// Hook para gerenciar projetos
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) throw error;
      setProjects((data || []) as Project[]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => [...prev, data as Project].sort((a, b) => a.order_position - b.order_position));
      return data;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => prev.map(project => 
        project.id === id ? data as Project : project
      ).sort((a, b) => a.order_position - b.order_position));
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
};

// Hook para gerenciar recrutamentos
export const useRecruitments = () => {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecruitments = async () => {
    try {
      const { data, error } = await supabase
        .from('recruitments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecruitments((data || []) as Recruitment[]);
    } catch (error) {
      console.error('Error fetching recruitments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruitments();
  }, []);

  const addRecruitment = async (recruitment: Omit<Recruitment, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('recruitments')
        .insert({ ...recruitment, status: 'pending' })
        .select()
        .single();

      if (error) throw error;
      setRecruitments(prev => [data as Recruitment, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding recruitment:', error);
      throw error;
    }
  };

  const updateRecruitmentStatus = async (id: string, status: Recruitment['status']) => {
    try {
      const { data, error } = await supabase
        .from('recruitments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRecruitments(prev => prev.map(recruitment => 
        recruitment.id === id ? data as Recruitment : recruitment
      ));
      return data;
    } catch (error) {
      console.error('Error updating recruitment status:', error);
      throw error;
    }
  };

  const deleteRecruitment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recruitments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecruitments(prev => prev.filter(recruitment => recruitment.id !== id));
    } catch (error) {
      console.error('Error deleting recruitment:', error);
      throw error;
    }
  };

  return {
    recruitments,
    isLoading,
    addRecruitment,
    updateRecruitmentStatus,
    deleteRecruitment,
    refetch: fetchRecruitments
  };
};

// Hook para gerenciar contatos
export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts((data || []) as Contact[]);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const addContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert({ ...contact, status: 'new' })
        .select()
        .single();

      if (error) throw error;
      setContacts(prev => [data as Contact, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  const updateContactStatus = async (id: string, status: Contact['status']) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setContacts(prev => prev.map(contact => 
        contact.id === id ? data as Contact : contact
      ));
      return data;
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContacts(prev => prev.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  return {
    contacts,
    isLoading,
    addContact,
    updateContactStatus,
    deleteContact,
    refetch: fetchContacts
  };
};