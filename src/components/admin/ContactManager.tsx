import { useState } from 'react';
import { useContacts, Contact } from '@/hooks/useAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Mail, Calendar, Trash2, Eye, Reply, User, Search, Filter, CheckCircle, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { usePdfExport } from '@/hooks/usePdfExport';

const ContactManager = () => {
  const { contacts, isLoading, updateContactStatus, deleteContact } = useContacts();
  const { exportContactsToPdf } = usePdfExport();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const getStatusBadge = (status: Contact['status']) => {
    const variants = {
      new: 'bg-green-500/10 text-green-600 border-green-500/20',
      read: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      replied: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    };

    const labels = {
      new: 'Novo',
      read: 'Lido',
      replied: 'Respondido'
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.mensagem.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (contactId: string, newStatus: Contact['status']) => {
    try {
      await updateContactStatus(contactId, newStatus);
      toast({
        title: "Status atualizado!",
        description: "O status do contato foi alterado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do contato.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      toast({
        title: "Contato excluído!",
        description: "O contato foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o contato.",
        variant: "destructive",
      });
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.status === 'new') {
      handleStatusChange(contact.id, 'read');
    }
  };

  const handleDownloadPdf = () => {
    const dataToExport = filteredContacts.length > 0 ? filteredContacts : contacts;
    exportContactsToPdf(dataToExport);
    toast({
      title: "PDF gerado!",
      description: `Relatório com ${dataToExport.length} contatos baixado com sucesso.`,
    });
  };

  const contactStats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-orbitron font-bold gradient-text">Contatos</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-orbitron font-bold gradient-text">Contatos</h1>
        <Button 
          onClick={handleDownloadPdf}
          className="bg-gradient-primary hover:shadow-button font-orbitron gap-2"
          disabled={contacts.length === 0}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Baixar PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Total</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{contactStats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-sm font-medium text-muted-foreground">Novos</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{contactStats.new}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <p className="text-sm font-medium text-muted-foreground">Lidos</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{contactStats.read}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <p className="text-sm font-medium text-muted-foreground">Respondidos</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{contactStats.replied}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou mensagem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="new">Novos</SelectItem>
                  <SelectItem value="read">Lidos</SelectItem>
                  <SelectItem value="replied">Respondidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="grid gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground">{contact.nome}</h3>
                    {getStatusBadge(contact.status)}
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{contact.createdAt.toLocaleDateString('pt-BR')}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {contact.mensagem}
                  </p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewContact(contact)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>{contact.nome}</span>
                        </DialogTitle>
                        <DialogDescription>
                          Contato recebido em {contact.createdAt.toLocaleDateString('pt-BR')}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Nome</label>
                            <Input value={contact.nome} readOnly />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input value={contact.email} readOnly />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Mensagem</label>
                          <Textarea 
                            value={contact.mensagem} 
                            readOnly 
                            rows={6}
                            className="resize-none"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium">Status</label>
                            <Select 
                              value={contact.status} 
                              onValueChange={(value) => handleStatusChange(contact.id, value as Contact['status'])}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">Novo</SelectItem>
                                <SelectItem value="read">Lido</SelectItem>
                                <SelectItem value="replied">Respondido</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button 
                            onClick={() => window.open(`mailto:${contact.email}?subject=Re: Contato DreamCore`)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Reply className="h-4 w-4 mr-2" />
                            Responder
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Botão para marcar como respondido */}
                  {contact.status !== 'replied' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(contact.id, 'replied')}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300"
                      title="Marcar como respondido"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir contato</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteContact(contact.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredContacts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum contato encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Quando alguém enviar uma mensagem pelo formulário de contato, ela aparecerá aqui.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContactManager;