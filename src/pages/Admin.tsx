import { useAdminAuth } from '@/hooks/useAdmin';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { BannerManager } from '@/components/admin/BannerManager';
import { RecruitmentManager } from '@/components/admin/RecruitmentManager';
import { UserManager } from '@/components/admin/UserManager';
import { AdminSettings } from '@/components/admin/AdminSettings';
import ContactManager from '@/components/admin/ContactManager';
import { SecurityMonitorPage } from '@/components/admin/SecurityMonitorPage';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';

const Admin = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex relative bg-background">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 right-20 w-40 h-40 hexagon bg-primary/20 animate-float"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 hexagon bg-accent/20 animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        
        <AdminSidebar />
        
        <SidebarInset>
          {/* Header com trigger do sidebar */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DC</span>
              </div>
              <div>
                <h1 className="font-semibold text-lg">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">DreamCore Gaming</p>
              </div>
            </div>
          </header>
          
          <main className="flex-1 flex flex-col gap-4 p-4">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/banners" element={<BannerManager />} />
              <Route path="/recruitments" element={<RecruitmentManager />} />
              <Route path="/contacts" element={<ContactManager />} />
              <Route path="/users" element={<UserManager />} />
              <Route path="/security" element={<SecurityMonitorPage />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Admin;