import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Target
} from 'lucide-react';

interface DataVisualizationProps {
  recruitmentStats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  contactStats: {
    total: number;
    new: number;
    read: number;
    replied: number;
  };
  monthlyData?: Array<{
    month: string;
    recruitments: number;
    contacts: number;
  }>;
}

export const DataVisualization = ({ 
  recruitmentStats, 
  contactStats, 
  monthlyData = [] 
}: DataVisualizationProps) => {
  
  // Dados para gráfico de pizza dos recrutamentos
  const recruitmentPieData = [
    { name: 'Pendente', value: recruitmentStats.pending, color: '#F59E0B' },
    { name: 'Aprovado', value: recruitmentStats.approved, color: '#10B981' },
    { name: 'Rejeitado', value: recruitmentStats.rejected, color: '#EF4444' }
  ];

  // Dados para gráfico de pizza dos contatos
  const contactPieData = [
    { name: 'Novo', value: contactStats.new, color: '#3B82F6' },
    { name: 'Lido', value: contactStats.read, color: '#8B5CF6' },
    { name: 'Respondido', value: contactStats.replied, color: '#10B981' }
  ];

  // Dados mock para o gráfico mensal se não fornecidos
  const defaultMonthlyData = [
    { month: 'Jan', recruitments: 12, contacts: 28 },
    { month: 'Fev', recruitments: 18, contacts: 35 },
    { month: 'Mar', recruitments: 22, contacts: 42 },
    { month: 'Abr', recruitments: 16, contacts: 38 },
    { month: 'Mai', recruitments: 25, contacts: 48 },
    { month: 'Jun', recruitments: 29, contacts: 52 }
  ];

  const chartData = monthlyData.length > 0 ? monthlyData : defaultMonthlyData;

  // Calcula taxas de conversão e métricas
  const recruitmentConversionRate = recruitmentStats.total > 0 
    ? Math.round((recruitmentStats.approved / recruitmentStats.total) * 100) 
    : 0;

  const contactResponseRate = contactStats.total > 0 
    ? Math.round((contactStats.replied / contactStats.total) * 100) 
    : 0;

  const totalEngagement = recruitmentStats.total + contactStats.total;

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Engajamento</p>
                <p className="text-3xl font-bold font-orbitron text-foreground">{totalEngagement}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+12% este mês</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Aprovação</p>
                <p className="text-3xl font-bold font-orbitron text-foreground">{recruitmentConversionRate}%</p>
                <Progress value={recruitmentConversionRate} className="mt-2 h-2" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Resposta</p>
                <p className="text-3xl font-bold font-orbitron text-foreground">{contactResponseRate}%</p>
                <Progress value={contactResponseRate} className="mt-2 h-2" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Médio Resposta</p>
                <p className="text-3xl font-bold font-orbitron text-foreground">2.4h</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  Excelente
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Tendências Mensais */}
        <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="gradient-text">Tendências Mensais</CardTitle>
            <CardDescription>
              Evolução de candidaturas e contatos ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="recruitments" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                  name="Candidaturas"
                />
                <Area 
                  type="monotone" 
                  dataKey="contacts" 
                  stackId="1"
                  stroke="hsl(var(--accent))" 
                  fill="hsl(var(--accent))"
                  fillOpacity={0.6}
                  name="Contatos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status dos Recrutamentos */}
        <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="gradient-text">Status dos Recrutamentos</CardTitle>
            <CardDescription>
              Distribuição atual dos status das candidaturas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={recruitmentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {recruitmentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center gap-4 mt-4">
              {recruitmentPieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status dos Contatos */}
        <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="gradient-text">Status dos Contatos</CardTitle>
            <CardDescription>
              Distribuição dos status das mensagens recebidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contactPieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Métricas de Performance */}
        <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="gradient-text">Performance Semanal</CardTitle>
            <CardDescription>
              Atividade e engagement dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Novas Candidaturas</span>
                  <span className="font-medium">{recruitmentStats.pending}</span>
                </div>
                <Progress value={(recruitmentStats.pending / Math.max(recruitmentStats.total, 1)) * 100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contatos Novos</span>
                  <span className="font-medium">{contactStats.new}</span>
                </div>
                <Progress value={(contactStats.new / Math.max(contactStats.total, 1)) * 100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
                  <span className="font-medium">{recruitmentConversionRate}%</span>
                </div>
                <Progress value={recruitmentConversionRate} className="h-2" />
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">+15% comparado à semana passada</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};