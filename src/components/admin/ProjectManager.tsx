import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { useProjects } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { FolderPlus, Folder, Edit, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Link, Tags } from 'lucide-react';

export const ProjectManager = () => {
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'development' as 'active' | 'development',
    link: '',
    tags: '',
    order: 1,
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      status: 'development',
      link: '',
      tags: '',
      order: 1,
      isActive: true
    });
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const projectData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      if (editingProject) {
        await updateProject(editingProject, projectData);
        toast({
          title: "Projeto atualizado! ✅",
          description: `${formData.name} foi atualizado com sucesso.`,
        });
      } else {
        await addProject(projectData);
        toast({
          title: "Projeto criado! 🎉",
          description: `${formData.name} foi adicionado aos projetos.`,
        });
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar projeto",
        description: "Não foi possível salvar o projeto. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  };

  const handleEdit = (project: any) => {
    setFormData({
      name: project.name,
      description: project.description,
      image: project.image,
      status: project.status,
      link: project.link || '',
      tags: project.tags.join(', '),
      order: project.order,
      isActive: project.isActive
    });
    setEditingProject(project.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (projectId: string, projectName: string) => {
    try {
      await deleteProject(projectId);
      toast({
        title: "Projeto removido",
        description: `${projectName} foi removido dos projetos.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover projeto",
        description: "Não foi possível remover o projeto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (projectId: string, isActive: boolean) => {
    try {
      await updateProject(projectId, { isActive });
      toast({
        title: isActive ? "Projeto ativado" : "Projeto desativado",
        description: `O projeto foi ${isActive ? 'ativado' : 'desativado'} no slider.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do projeto.",
        variant: "destructive"
      });
    }
  };

  const handleOrderChange = async (projectId: string, direction: 'up' | 'down') => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newOrder = direction === 'up' ? project.order - 1 : project.order + 1;
    
    try {
      await updateProject(projectId, { order: newOrder });
      toast({
        title: "Ordem alterada",
        description: `A posição do projeto foi alterada.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar ordem",
        description: "Não foi possível alterar a ordem do projeto.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => (
    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
      {status === 'active' ? 'Ativo' : 'Em Desenvolvimento'}
    </Badge>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Carregando projetos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold gradient-text">
            Gerenciar Projetos
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure os projetos exibidos no slider da página inicial
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-primary hover:shadow-button font-orbitron"
              onClick={resetForm}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-orbitron">
                {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
              </DialogTitle>
              <DialogDescription>
                {editingProject 
                  ? 'Edite as informações do projeto no slider.' 
                  : 'Adicione um novo projeto ao slider da página inicial.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Projeto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome do projeto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Ordem de Exibição</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o projeto..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'active' | 'development') => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Em Desenvolvimento</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link do Projeto (opcional)</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="https://projeto.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="React, Node.js, Gaming, AI"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Exibir no slider</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-primary hover:shadow-button"
                >
                  {isSubmitting ? "Salvando..." : (editingProject ? "Atualizar" : "Criar")}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="card-gradient border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-primary" />
            Projetos Cadastrados
          </CardTitle>
          <CardDescription>
            Lista de todos os projetos configurados para o slider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Visível</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{project.order}</span>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOrderChange(project.id, 'up')}
                          className="h-4 w-4 p-0"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOrderChange(project.id, 'down')}
                          className="h-4 w-4 p-0"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {project.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(project.id, !project.isActive)}
                      className="h-8 w-8 p-0"
                    >
                      {project.isActive ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover projeto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O projeto <strong>{project.name}</strong> será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(project.id, project.name)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {projects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum projeto cadastrado</p>
              <p className="text-sm">Clique em "Novo Projeto" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};