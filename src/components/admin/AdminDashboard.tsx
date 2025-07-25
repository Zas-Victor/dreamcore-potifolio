import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Image,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  Settings
} from 'lucide-react';
import { useBanners, useRecruitments } from '@/hooks/useAdmin';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { banners, isLoading: bannersLoading } = useBanners();
  const { recruitments, isLoading: recruitmentsLoading } = useRecruitments();

  const isLoading = bannersLoading || recruitmentsLoading;

  // Estatísticas gerais
  const stats = {
    totalBanners: banners.length,
    activeBanners: banners.filter(b => b.isActive).length,
    totalRecruitments: recruitments.length,
    pendingRecruitments: recruitments.filter(r => r.status === 'pending').length,
    approvedRecruitments: recruitments.filter(r => r.status === 'approved').length,
    rejectedRecruitments: recruitments.filter(r => r.status === 'rejected').length,
  };

  // Dados para gráficos
  const recruitmentStatusData = [
    { name: 'Pendente', value: stats.pendingRecruitments, color: '#f59e0b' },
    { name: 'Aprovado', value: stats.approvedRecruitments, color: '#10b981' },
    { name: 'Rejeitado', value: stats.rejectedRecruitments, color: '#ef4444' },
  ];

  const monthlyRecruitments = recruitments.reduce((acc, recruitment) => {
    const month = recruitment.createdAt.toLocaleDateString('pt-BR', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyRecruitments).map(([month, count]) => ({
    month,
    count
  }));

  // Recrutamentos recentes
  const recentRecruitments = recruitments
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold gradient-text mb-3 text-shadow">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Visão geral da plataforma DreamCore Gaming Collective
          </p>
          <div className="w-20 h-1 bg-gradient-primary rounded-full mt-4 mx-auto lg:mx-0"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total de Banners</p>
              <p className="text-2xl sm:text-3xl font-bold font-orbitron">{stats.totalBanners}</p>
              <p className="text-xs text-muted-foreground truncate">
                {stats.activeBanners} ativos
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <Image className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Candidaturas</p>
              <p className="text-2xl sm:text-3xl font-bold font-orbitron">{stats.totalRecruitments}</p>
              <p className="text-xs text-muted-foreground truncate">
                {stats.pendingRecruitments} pendentes
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <Users className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Taxa de Aprovação</p>
              <p className="text-2xl sm:text-3xl font-bold font-orbitron text-green-400">
                {stats.totalRecruitments > 0 
                  ? Math.round((stats.approvedRecruitments / stats.totalRecruitments) * 100)
                  : 0
                }%
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {stats.approvedRecruitments} aprovados
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Pendentes</p>
              <p className="text-2xl sm:text-3xl font-bold font-orbitron text-yellow-400 animate-pulse-slow">{stats.pendingRecruitments}</p>
              <p className="text-xs text-muted-foreground truncate">
                Requerem atenção
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Recruitment Status Chart */}
        <Card className="p-4 sm:p-6 card-gradient border-border/50">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Status das Candidaturas</h3>
          {recruitmentStatusData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
              <PieChart>
                <Pie
                  data={recruitmentStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  className="sm:outerRadius-[80px]"
                >
                  {recruitmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 sm:h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Users className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">Nenhuma candidatura ainda</p>
              </div>
            </div>
          )}
        </Card>

        {/* Monthly Recruitments Chart */}
        <Card className="p-4 sm:p-6 card-gradient border-border/50">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Candidaturas por Mês</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 sm:h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">Dados insuficientes para o gráfico</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Recruitments */}
      <Card className="p-4 sm:p-6 card-gradient border-border/50 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-base sm:text-lg font-semibold">Candidaturas Recentes</h3>
          <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
            <Link to="/admin/recruitments">
              <Eye className="w-4 h-4 mr-2" />
              Ver Todas
            </Link>
          </Button>
        </div>

        {recentRecruitments.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {recentRecruitments.map((recruitment) => (
              <div key={recruitment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base truncate">{recruitment.nomeCompleto}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {recruitment.areaInteresse.slice(0, 2).join(', ')}
                      {recruitment.areaInteresse.length > 2 && ` +${recruitment.areaInteresse.length - 2}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="hidden sm:inline">{recruitment.createdAt.toLocaleDateString('pt-BR')}</span>
                    <span className="sm:hidden">{recruitment.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                  </div>
                  
                  <Badge 
                    variant={
                      recruitment.status === 'approved' ? 'default' :
                      recruitment.status === 'rejected' ? 'destructive' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {recruitment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {recruitment.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {recruitment.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {recruitment.status === 'pending' ? 'Pendente' :
                     recruitment.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h4 className="text-xl font-semibold mb-3 font-orbitron">Nenhuma candidatura ainda</h4>
            <p className="text-muted-foreground max-w-md mx-auto">
              As candidaturas aparecerão aqui conforme forem enviadas pelos usuários interessados em se juntar ao DreamCore
            </p>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 sm:p-6 card-gradient border-border/50 mb-8">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Button asChild className="h-auto p-4 sm:p-6 justify-start hover:shadow-glow transition-all duration-300 group">
            <Link to="/admin/banners">
              <div className="text-left w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors flex-shrink-0">
                    <Image className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm sm:text-lg">Gerenciar Banners</span>
                </div>
                <p className="text-xs sm:text-sm opacity-80">Adicionar ou editar banners da plataforma</p>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 sm:p-6 justify-start hover:shadow-glow hover:border-primary/50 transition-all duration-300 group">
            <Link to="/admin/recruitments">
              <div className="text-left w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <span className="font-semibold text-sm sm:text-lg">Ver Candidaturas</span>
                </div>
                <p className="text-xs sm:text-sm opacity-80">Analisar e aprovar novas candidaturas</p>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 sm:p-6 justify-start hover:shadow-glow hover:border-primary/50 transition-all duration-300 group sm:col-span-2 lg:col-span-1">
            <Link to="/admin/settings">
              <div className="text-left w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  </div>
                  <span className="font-semibold text-sm sm:text-lg">Configurações</span>
                </div>
                <p className="text-xs sm:text-sm opacity-80">Ajustar configurações do sistema</p>
              </div>
            </Link>
          </Button>
        </div>
      </Card>

      {/* Supabase Integration Notice */}
      <Card className="p-6 bg-muted/30 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-sm">🚀</span>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-1">
              Pronto para Supabase
            </h4>
            <p className="text-sm text-muted-foreground">
              Esta área administrativa está completamente preparada para integração com Supabase. 
              Conecte seu projeto para dados em tempo real, notificações automáticas e relatórios avançados.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};