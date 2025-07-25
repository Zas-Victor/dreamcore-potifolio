import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';

// Interface para usuários administrativos (ainda usará localStorage até integração completa)
export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  status: 'active' | 'pending' | 'suspended';
  temporaryPassword?: string;
  passwordChanged: boolean;
  lastAccess?: Date;
  createdAt: Date;
}

// Hook para autenticação administrativa - agora usa Supabase
export const useAdminAuth = () => {
  const { user, isLoading, isAdmin, signIn, signOut } = useSupabaseAuth();

  const login = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Erro ao fazer login:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    isAuthenticated: !!user && isAdmin,
    isLoading,
    login,
    logout
  };
};

// Re-export interfaces do Supabase para compatibilidade
export type { Banner, Project, Recruitment, Contact } from './useSupabaseData';

// Re-export hooks do Supabase para compatibilidade
export { useBanners, useProjects, useRecruitments, useContacts } from './useSupabaseData';

// Hook para gerenciar usuários administrativos (preparado para Supabase)
export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de dados - será substituído por consulta Supabase
    const storedUsers = localStorage.getItem('dreamcore_admin_users');
    const mockUsers: AdminUser[] = storedUsers ? JSON.parse(storedUsers) : [
      {
        id: 'admin-main',
        nome: 'Administrador Principal',
        email: 'admin@dreamcore.com',
        cargo: 'admin',
        status: 'active',
        passwordChanged: true,
        lastAccess: new Date(),
        createdAt: new Date('2024-01-01')
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const addUser = async (userData: { nome: string; email: string; cargo: string }) => {
    // TODO: Integrar com Supabase para criar usuário e enviar email
    const temporaryPassword = generatePassword();
    
    const newUser: AdminUser = {
      id: Date.now().toString(),
      nome: userData.nome,
      email: userData.email,
      cargo: userData.cargo,
      status: 'pending',
      temporaryPassword,
      passwordChanged: false,
      createdAt: new Date()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('dreamcore_admin_users', JSON.stringify(updatedUsers));

    // TODO: Enviar email com senha temporária via Supabase Edge Function
    console.log(`Email enviado para ${userData.email} com senha: ${temporaryPassword}`);
    
    return { temporaryPassword };
  };

  const regeneratePassword = async (userId: string) => {
    // TODO: Integrar com Supabase
    const newPassword = generatePassword();
    
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, temporaryPassword: newPassword, passwordChanged: false }
        : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('dreamcore_admin_users', JSON.stringify(updatedUsers));
    
    // TODO: Enviar email com nova senha via Supabase Edge Function
    return newPassword;
  };

  const deleteUser = async (userId: string) => {
    // TODO: Integrar com Supabase
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('dreamcore_admin_users', JSON.stringify(updatedUsers));
  };

  const updateUserPassword = async (userId: string, newPassword: string) => {
    // TODO: Integrar com Supabase
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, passwordChanged: true, temporaryPassword: undefined }
        : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('dreamcore_admin_users', JSON.stringify(updatedUsers));
  };

  return {
    users,
    isLoading,
    addUser,
    regeneratePassword,
    deleteUser,
    updateUserPassword
  };
};