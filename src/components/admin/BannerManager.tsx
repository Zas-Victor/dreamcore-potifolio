import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Image as ImageIcon,
  Calendar
} from 'lucide-react';
import { useBanners, Banner } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export const BannerManager = () => {
  const { banners, isLoading, addBanner, updateBanner, deleteBanner } = useBanners();
  const { toast } = useToast();
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      isActive: true
    });
    setSelectedBanner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedBanner) {
        await updateBanner(selectedBanner.id, formData);
        toast({
          title: "Banner atualizado! ✨",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        await addBanner(formData);
        toast({
          title: "Banner criado! 🎉",
          description: "Novo banner adicionado à plataforma.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      isActive: banner.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      try {
        await deleteBanner(id);
        toast({
          title: "Banner removido",
          description: "Banner excluído com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o banner.",
          variant: "destructive"
        });
      }
    }
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      await updateBanner(banner.id, { isActive: !banner.isActive });
      toast({
        title: banner.isActive ? "Banner desativado" : "Banner ativado",
        description: `Banner ${banner.isActive ? 'oculto' : 'exibido'} na plataforma.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do banner.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="w-full h-32 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-orbitron font-bold gradient-text text-shadow">
            Gerenciar Banners
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg mt-2">
            Controle os banners exibidos na plataforma
          </p>
          <div className="w-16 h-1 bg-gradient-primary rounded-full mt-3"></div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-primary hover:shadow-button gap-2 h-10 sm:h-11 px-4 sm:px-6 font-semibold text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Novo Banner
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="gradient-text">
                {selectedBanner ? 'Editar Banner' : 'Criar Novo Banner'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Título do banner"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição do banner"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Banner ativo</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {selectedBanner ? 'Atualizar' : 'Criar'} Banner
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="p-4 sm:p-6 card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
            <div className="space-y-3 sm:space-y-4">
              {/* Image */}
              <div className="relative w-full h-24 sm:h-32 bg-muted rounded-lg overflow-hidden">
                {banner.imageUrl !== '/placeholder.svg' ? (
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant={banner.isActive ? "default" : "secondary"} className="text-xs">
                    {banner.isActive ? (
                      <><Eye className="w-3 h-3 mr-1" /> Ativo</>
                    ) : (
                      <><EyeOff className="w-3 h-3 mr-1" /> Inativo</>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1 sm:space-y-2">
                <h3 className="font-semibold text-base sm:text-lg leading-tight">
                  {banner.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {banner.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {banner.createdAt.toLocaleDateString('pt-BR')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBannerStatus(banner)}
                  className="flex-1 text-xs sm:text-sm"
                >
                  {banner.isActive ? (
                    <><EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Desativar</>
                  ) : (
                    <><Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Ativar</>
                  )}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(banner)}
                    className="flex-1 sm:flex-initial"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                    className="text-destructive hover:text-destructive flex-1 sm:flex-initial"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {banners.length === 0 && !isLoading && (
        <Card className="p-12 text-center card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h3 className="text-xl font-semibold mb-3 font-orbitron">Nenhum banner encontrado</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Crie seu primeiro banner para começar a personalizar a experiência dos usuários na plataforma
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-primary hover:shadow-button">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Banner
          </Button>
        </Card>
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
              Conecte seu projeto para armazenamento permanente, upload de imagens e sincronização em tempo real.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};