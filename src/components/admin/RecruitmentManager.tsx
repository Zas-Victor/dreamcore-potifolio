import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Trash2,
  MoreHorizontal,
  Calendar,
  Mail,
  User,
  MapPin,
  Download
} from 'lucide-react';
import { useRecruitments, Recruitment } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { usePdfExport } from '@/hooks/usePdfExport';

export const RecruitmentManager = () => {
  const { recruitments, isLoading, updateRecruitmentStatus, deleteRecruitment } = useRecruitments();
  const { toast } = useToast();
  const { exportRecruitmentsToPdf } = usePdfExport();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecruitment, setSelectedRecruitment] = useState<Recruitment | null>(null);

  const filteredRecruitments = recruitments.filter(recruitment => {
    const matchesSearch = 
      recruitment.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruitment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruitment.areaInteresse.some(area => 
        area.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' || recruitment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Recruitment['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'approved':
        return <Badge variant="default">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  const handleStatusUpdate = async (id: string, status: Recruitment['status']) => {
    try {
      await updateRecruitmentStatus(id, status);
      toast({
        title: "Status atualizado!",
        description: `Candidatura ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta candidatura?')) {
      try {
        await deleteRecruitment(id);
        toast({
          title: "Candidatura removida",
          description: "Candidatura excluída com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir a candidatura.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDownloadPdf = () => {
    const dataToExport = filteredRecruitments.length > 0 ? filteredRecruitments : recruitments;
    exportRecruitmentsToPdf(dataToExport);
    toast({
      title: "PDF gerado!",
      description: `Relatório com ${dataToExport.length} candidaturas baixado com sucesso.`,
    });
  };

  const stats = {
    total: recruitments.length,
    pending: recruitments.filter(r => r.status === 'pending').length,
    approved: recruitments.filter(r => r.status === 'approved').length,
    rejected: recruitments.filter(r => r.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
        <Card className="p-6 animate-pulse">
          <div className="h-64 bg-muted rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-orbitron font-bold gradient-text text-shadow">
            Gerenciar Recrutamentos
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg mt-2">
            Analise e gerencie as candidaturas recebidas
          </p>
          <div className="w-16 h-1 bg-gradient-primary rounded-full mt-3"></div>
        </div>
        
        <Button 
          onClick={handleDownloadPdf}
          className="bg-gradient-primary hover:shadow-button font-orbitron gap-2"
          disabled={recruitments.length === 0}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Baixar PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <Card className="p-3 sm:p-6 card-gradient border-border/50 hover:shadow-glow transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-xl sm:text-3xl font-bold font-orbitron">{stats.total}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <User className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6 card-gradient border-border/50 hover:shadow-glow transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Pendentes</p>
              <p className="text-xl sm:text-3xl font-bold font-orbitron text-yellow-400 animate-pulse-slow">{stats.pending}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6 card-gradient border-border/50 hover:shadow-glow transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Aprovados</p>
              <p className="text-xl sm:text-3xl font-bold font-orbitron text-green-400">{stats.approved}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <Check className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6 card-gradient border-border/50 hover:shadow-glow transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Rejeitados</p>
              <p className="text-xl sm:text-3xl font-bold font-orbitron text-red-400">{stats.rejected}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <X className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:shadow-glow transition-all duration-300 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email ou área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 hover:shadow-md transition-all duration-200 text-sm w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                <span className="sm:hidden">Filtrar</span>
                <span className="hidden sm:inline">Status: {statusFilter === 'all' ? 'Todos' : 
                        statusFilter === 'pending' ? 'Pendentes' :
                        statusFilter === 'approved' ? 'Aprovados' : 'Rejeitados'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pendentes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                Aprovados
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                Rejeitados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Table */}
      <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Candidato</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[150px]">Localização</TableHead>
                <TableHead className="min-w-[120px]">Áreas</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="hidden md:table-cell min-w-[100px]">Data</TableHead>
                <TableHead className="text-right min-w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecruitments.map((recruitment) => (
                <TableRow key={recruitment.id}>
                  <TableCell className="max-w-[200px]">
                    <div>
                      <div className="font-medium text-sm truncate">{recruitment.nomeCompleto}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{recruitment.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="hidden sm:table-cell max-w-[150px]">
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{recruitment.localidade}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="max-w-[120px]">
                    <div className="flex flex-wrap gap-1">
                      {recruitment.areaInteresse.slice(0, 1).map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {recruitment.areaInteresse.length > 1 && (
                        <Badge variant="outline" className="text-xs">
                          +{recruitment.areaInteresse.length - 1}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(recruitment.status)}
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell">
                    <div className="text-xs text-muted-foreground">
                      {recruitment.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedRecruitment(recruitment);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </Dialog>
                        
                        {recruitment.status === 'pending' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(recruitment.id, 'approved')}
                              className="text-green-600"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Aprovar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(recruitment.id, 'rejected')}
                              className="text-red-600"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Rejeitar
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(recruitment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRecruitments.length === 0 && !isLoading && (
          <div className="p-16 text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-xl font-semibold mb-3 font-orbitron">
              {searchTerm || statusFilter !== 'all' 
                ? 'Nenhuma candidatura encontrada' 
                : 'Nenhuma candidatura ainda'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca ou limpar os termos para ver mais resultados' 
                : 'As candidaturas aparecerão aqui conforme forem enviadas pelos usuários'}
            </p>
          </div>
        )}
      </Card>

      {/* Details Dialog */}
      {selectedRecruitment && (
        <Dialog open={!!selectedRecruitment} onOpenChange={() => setSelectedRecruitment(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="gradient-text">
                Detalhes da Candidatura
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedRecruitment.nomeCompleto}</h3>
                  <p className="text-muted-foreground">{selectedRecruitment.email}</p>
                </div>
                {getStatusBadge(selectedRecruitment.status)}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Idade</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecruitment.idade} anos</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Discord</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecruitment.discord}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Localização</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecruitment.localidade}</p>
                </div>
              </div>

              {/* Areas of Interest */}
              <div>
                <Label className="text-sm font-medium">Áreas de Interesse</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRecruitment.areaInteresse.map((area) => (
                    <Badge key={area} variant="outline">{area}</Badge>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <Label className="text-sm font-medium">Experiência</Label>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                  {selectedRecruitment.experiencia}
                </p>
              </div>

              {/* Motivation */}
              <div>
                <Label className="text-sm font-medium">Motivação</Label>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                  {selectedRecruitment.motivacao}
                </p>
              </div>

              {/* Actions */}
              {selectedRecruitment.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => {
                      handleStatusUpdate(selectedRecruitment.id, 'approved');
                      setSelectedRecruitment(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Aprovar Candidatura
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleStatusUpdate(selectedRecruitment.id, 'rejected');
                      setSelectedRecruitment(null);
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rejeitar Candidatura
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Supabase Integration Notice */}
      <Card className="p-6 bg-muted/30 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-sm">!</span>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-1">
              🚀 Pronto para Supabase
            </h4>
            <p className="text-sm text-muted-foreground">
              Esta interface está preparada para integração com Supabase. 
              Conecte seu projeto para persistência de dados, notificações por email e relatórios avançados.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};