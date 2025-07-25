import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface RecruitmentData {
  id: string;
  nomeCompleto: string;
  email: string;
  idade: string;
  discord: string;
  localidade: string;
  areaInteresse: string[];
  experiencia: string;
  motivacao: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface ContactData {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

export const usePdfExport = () => {
  const exportRecruitmentsToPdf = (recruitments: RecruitmentData[]) => {
    const doc = new jsPDF();
    
    // Header com logo e título
    doc.setFontSize(20);
    doc.setTextColor(37, 110, 255); // Electric Blue
    doc.text('DreamCore', 20, 25);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Relatório de Recrutamentos', 20, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 45);
    doc.text(`Total de candidaturas: ${recruitments.length}`, 20, 50);
    
    // Linha separadora
    doc.setDrawColor(37, 110, 255);
    doc.line(20, 55, 190, 55);
    
    // Preparar dados para a tabela
    const tableData = recruitments.map(recruitment => [
      recruitment.nomeCompleto,
      recruitment.email,
      recruitment.idade,
      recruitment.localidade,
      recruitment.areaInteresse.join(', '),
      recruitment.status === 'pending' ? 'Pendente' : 
      recruitment.status === 'approved' ? 'Aprovado' : 'Rejeitado',
      recruitment.createdAt.toLocaleDateString('pt-BR')
    ]);
    
    // Gerar tabela
    autoTable(doc, {
      head: [['Nome', 'Email', 'Idade', 'Localidade', 'Áreas de Interesse', 'Status', 'Data']],
      body: tableData,
      startY: 65,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [37, 110, 255],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Nome
        1: { cellWidth: 35 }, // Email
        2: { cellWidth: 15 }, // Idade
        3: { cellWidth: 25 }, // Localidade
        4: { cellWidth: 40 }, // Áreas
        5: { cellWidth: 20 }, // Status
        6: { cellWidth: 20 }, // Data
      },
    });
    
    // Nova página para detalhes (se necessário)
    if (recruitments.length > 0) {
      doc.addPage();
      
      doc.setFontSize(16);
      doc.setTextColor(37, 110, 255);
      doc.text('Detalhes das Candidaturas', 20, 25);
      
      let yPosition = 40;
      
      recruitments.forEach((recruitment, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 25;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${recruitment.nomeCompleto}`, 20, yPosition);
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        
        yPosition += 8;
        doc.text(`Email: ${recruitment.email}`, 25, yPosition);
        
        yPosition += 6;
        doc.text(`Discord: ${recruitment.discord}`, 25, yPosition);
        
        yPosition += 6;
        doc.text(`Motivação: ${recruitment.motivacao.substring(0, 100)}${recruitment.motivacao.length > 100 ? '...' : ''}`, 25, yPosition);
        
        yPosition += 6;
        doc.text(`Experiência: ${recruitment.experiencia.substring(0, 100)}${recruitment.experiencia.length > 100 ? '...' : ''}`, 25, yPosition);
        
        yPosition += 15;
      });
    }
    
    // Salvar o arquivo
    const fileName = `dreamcore-recrutamentos-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  };
  
  const exportContactsToPdf = (contacts: ContactData[]) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 110, 255);
    doc.text('DreamCore', 20, 25);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Relatório de Contatos', 20, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 45);
    doc.text(`Total de contatos: ${contacts.length}`, 20, 50);
    
    // Linha separadora
    doc.setDrawColor(37, 110, 255);
    doc.line(20, 55, 190, 55);
    
    // Preparar dados para a tabela
    const tableData = contacts.map(contact => [
      contact.nome,
      contact.email,
      contact.mensagem.substring(0, 60) + (contact.mensagem.length > 60 ? '...' : ''),
      contact.status === 'new' ? 'Novo' : 
      contact.status === 'read' ? 'Lido' : 'Respondido',
      contact.createdAt.toLocaleDateString('pt-BR')
    ]);
    
    // Gerar tabela
    autoTable(doc, {
      head: [['Nome', 'Email', 'Mensagem', 'Status', 'Data']],
      body: tableData,
      startY: 65,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [37, 110, 255],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Nome
        1: { cellWidth: 40 }, // Email
        2: { cellWidth: 60 }, // Mensagem
        3: { cellWidth: 25 }, // Status
        4: { cellWidth: 25 }, // Data
      },
    });
    
    // Nova página para mensagens completas
    if (contacts.length > 0) {
      doc.addPage();
      
      doc.setFontSize(16);
      doc.setTextColor(37, 110, 255);
      doc.text('Mensagens Completas', 20, 25);
      
      let yPosition = 40;
      
      contacts.forEach((contact, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 25;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${contact.nome}`, 20, yPosition);
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        
        yPosition += 8;
        doc.text(`Email: ${contact.email}`, 25, yPosition);
        
        yPosition += 6;
        doc.text(`Data: ${contact.createdAt.toLocaleDateString('pt-BR')}`, 25, yPosition);
        
        yPosition += 8;
        doc.setTextColor(0, 0, 0);
        doc.text('Mensagem:', 25, yPosition);
        
        yPosition += 6;
        // Quebrar texto longo em múltiplas linhas
        const mensagemLines = doc.splitTextToSize(contact.mensagem, 160);
        doc.text(mensagemLines, 25, yPosition);
        
        yPosition += (mensagemLines.length * 5) + 10;
      });
    }
    
    // Salvar o arquivo
    const fileName = `dreamcore-contatos-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  };
  
  return {
    exportRecruitmentsToPdf,
    exportContactsToPdf
  };
};