-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'development' CHECK (status IN ('active', 'development')),
  link TEXT,
  tags TEXT[] DEFAULT '{}',
  order_position INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruitments table
CREATE TABLE public.recruitments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  idade TEXT NOT NULL,
  localidade TEXT NOT NULL,
  discord TEXT NOT NULL,
  email TEXT NOT NULL,
  area_interesse TEXT[] NOT NULL DEFAULT '{}',
  outro_interesse TEXT,
  experiencia TEXT NOT NULL,
  motivacao TEXT NOT NULL,
  relacao_gaming TEXT NOT NULL,
  portfolio TEXT,
  ferramentas TEXT NOT NULL,
  experiencia_colaborativa TEXT NOT NULL,
  experiencia_colaborativa_texto TEXT,
  horas_semanais TEXT NOT NULL,
  modelo_colaboracao TEXT NOT NULL,
  aceita_politicas BOOLEAN NOT NULL DEFAULT false,
  habilidade_principal TEXT NOT NULL,
  area_aprender TEXT,
  comentario_final TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin());

-- RLS Policies for banners (public read, admin write)
CREATE POLICY "Anyone can view active banners" 
ON public.banners 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all banners" 
ON public.banners 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can manage banners" 
ON public.banners 
FOR ALL 
USING (public.is_admin());

-- RLS Policies for projects (public read, admin write)
CREATE POLICY "Anyone can view active projects" 
ON public.projects 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all projects" 
ON public.projects 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can manage projects" 
ON public.projects 
FOR ALL 
USING (public.is_admin());

-- RLS Policies for recruitments (public insert, admin read/update)
CREATE POLICY "Anyone can submit recruitment" 
ON public.recruitments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all recruitments" 
ON public.recruitments 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update recruitments" 
ON public.recruitments 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete recruitments" 
ON public.recruitments 
FOR DELETE 
USING (public.is_admin());

-- RLS Policies for contacts (public insert, admin read/update)
CREATE POLICY "Anyone can submit contact" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all contacts" 
ON public.contacts 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update contacts" 
ON public.contacts 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete contacts" 
ON public.contacts 
FOR DELETE 
USING (public.is_admin());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruitments_updated_at
  BEFORE UPDATE ON public.recruitments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert some default data
INSERT INTO public.banners (title, description, image_url, is_active) VALUES
('Bem-vindo à DreamCore', 'Junte-se ao coletivo gamer-tech mais inovador', '/placeholder.svg', true),
('Recrutamento Aberto', 'Vagas abertas para desenvolvedores e designers', '/placeholder.svg', false);

INSERT INTO public.projects (name, description, image, status, link, tags, order_position, is_active) VALUES
('GameServer Pro', 'Plataforma avançada de servidores de jogos com alta performance e baixa latência. Suporte para múltiplos jogos e escalabilidade automática.', '/src/assets/project-1.jpg', 'active', 'https://gameserver.dreamcore.com', ARRAY['Game Servers', 'Cloud Computing', 'DevOps'], 1, true),
('DreamStack', 'Framework fullstack moderno para desenvolvimento rápido de aplicações web. Arquitetura escalável com integração nativa de gaming APIs.', '/src/assets/project-2.jpg', 'development', NULL, ARRAY['Fullstack', 'React', 'Node.js', 'Gaming APIs'], 2, true),
('MarketBot AI', 'Sistema de automação de marketing inteligente para empresas de gaming. Analytics avançados e integração com redes sociais.', '/src/assets/project-3.jpg', 'active', 'https://marketbot.dreamcore.com', ARRAY['AI', 'Marketing', 'Automation', 'Analytics'], 3, true);