// Utilitários para converter entre formatos antigos e novos do Supabase

import { Banner, Project, Recruitment, Contact } from '@/hooks/useSupabaseData';

// Mappers para compatibilidade com componentes existentes
export const mapBannerToLegacy = (banner: Banner) => ({
  ...banner,
  imageUrl: banner.image_url,
  isActive: banner.is_active,
  createdAt: new Date(banner.created_at)
});

export const mapProjectToLegacy = (project: Project) => ({
  ...project,
  order: project.order_position,
  isActive: project.is_active,
  createdAt: new Date(project.created_at)
});

export const mapRecruitmentToLegacy = (recruitment: Recruitment) => ({
  ...recruitment,
  nomeCompleto: recruitment.nome_completo,
  areaInteresse: recruitment.area_interesse,
  createdAt: new Date(recruitment.created_at)
});

export const mapContactToLegacy = (contact: Contact) => ({
  ...contact,
  createdAt: new Date(contact.created_at)
});

// Mappers para converter dados legacy para Supabase
export const mapBannerFromLegacy = (banner: any) => ({
  title: banner.title,
  description: banner.description,
  image_url: banner.imageUrl,
  is_active: banner.isActive
});

export const mapProjectFromLegacy = (project: any) => ({
  name: project.name,
  description: project.description,
  image: project.image,
  status: project.status,
  link: project.link,
  tags: project.tags,
  order_position: project.order,
  is_active: project.isActive
});