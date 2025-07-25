import { useRecruitments } from './useSupabaseData';

export interface RecruitmentSubmissionData {
  nomeCompleto: string;
  idade: string;
  localidade: string;
  discord: string;
  email: string;
  areaInteresse: string[];
  outroInteresse?: string;
  experiencia: string;
  motivacao: string;
  relacaoGaming: string;
  portfolio?: string;
  ferramentas: string;
  experienciaColaborativa: string;
  experienciaColaborativaTexto?: string;
  horasSemanais: string;
  modeloColaboracao: string;
  aceitaPoliticas: boolean;
  habilidadePrincipal: string;
  areaAprender?: string;
  comentarioFinal?: string;
}

export const useRecruitmentSubmission = () => {
  const { addRecruitment } = useRecruitments();

  const submitRecruitment = async (data: RecruitmentSubmissionData) => {
    try {
      // Converte os dados para o formato do Supabase
      const recruitmentData = {
        nome_completo: data.nomeCompleto,
        idade: data.idade,
        localidade: data.localidade,
        discord: data.discord,
        email: data.email,
        area_interesse: data.areaInteresse,
        outro_interesse: data.outroInteresse,
        experiencia: data.experiencia,
        motivacao: data.motivacao,
        relacao_gaming: data.relacaoGaming,
        portfolio: data.portfolio,
        ferramentas: data.ferramentas,
        experiencia_colaborativa: data.experienciaColaborativa,
        experiencia_colaborativa_texto: data.experienciaColaborativaTexto,
        horas_semanais: data.horasSemanais,
        modelo_colaboracao: data.modeloColaboracao,
        aceita_politicas: data.aceitaPoliticas,
        habilidade_principal: data.habilidadePrincipal,
        area_aprender: data.areaAprender,
        comentario_final: data.comentarioFinal
      };

      const result = await addRecruitment(recruitmentData);
      return { success: true, data: result };
    } catch (error) {
      console.error('Erro ao enviar candidatura:', error);
      throw error;
    }
  };

  return {
    submitRecruitment
  };
};