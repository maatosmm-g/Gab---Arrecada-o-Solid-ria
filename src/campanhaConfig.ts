import { Campaign } from './types';

/**
 * Interface que representa a estrutura centralizada de dados e cálculos da campanha.
 */
export interface CampaignDataSummary {
  metaGlobal: number;
  valorArrecadado: number;
  apoiadores: number;
  progressoPorcentagem: number;
  progressoPorcentagemAjustada: number;
  valorRestante: number;
  valorArrecadadoFormatado: string;
  metaGlobalFormatada: string;
  valorRestanteFormatado: string;
}

/**
 * Cria a estrutura baseada no objeto central "dadosDaCampanha" contendo
 * todas as propriedades estáticas e calculadas referentes aos valores da campanha.
 */
export function obterDadosDaCampanha(campaign: Campaign): CampaignDataSummary {
  const metaGlobal = campaign.targetAmount;
  const valorArrecadado = campaign.raisedAmount;
  const apoiadores = campaign.donorCount;

  // Cálculo de porcentagem de progresso padrão
  const progressoPorcentagem = metaGlobal > 0 
    ? Math.min(100, (valorArrecadado / metaGlobal) * 100) 
    : 0;

  // Cálculo de porcentagem de progresso ajustada (com o fator 1.05 histórico usado na aba Transparência)
  const progressoPorcentagemAjustada = metaGlobal > 0
    ? Math.min(100, Math.round((valorArrecadado / metaGlobal) * 105) / 1.05)
    : 0;

  // Valor restante para atingir a meta
  const valorRestante = Math.max(0, metaGlobal - valorArrecadado);

  // Formatações decimais em português (pt-BR)
  const valorArrecadadoFormatado = valorArrecadado.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  const metaGlobalFormatada = metaGlobal.toLocaleString('pt-BR');
  const valorRestanteFormatado = valorRestante.toLocaleString('pt-BR');

  return {
    metaGlobal,
    valorArrecadado,
    apoiadores,
    progressoPorcentagem,
    progressoPorcentagemAjustada,
    valorRestante,
    valorArrecadadoFormatado,
    metaGlobalFormatada,
    valorRestanteFormatado
  };
}

/**
 * Funções calculadas isoladas para uso direto quando necessário
 */

export const calcularProgresso = (valorArrecadado: number, metaGlobal: number): number => {
  if (metaGlobal <= 0) return 0;
  return Math.min(100, (valorArrecadado / metaGlobal) * 100);
};

export const calcularProgressoAjustado = (valorArrecadado: number, metaGlobal: number): number => {
  if (metaGlobal <= 0) return 0;
  return Math.min(100, Math.round((valorArrecadado / metaGlobal) * 105) / 1.05);
};

export const calcularValorRestante = (valorArrecadado: number, metaGlobal: number): number => {
  return Math.max(0, metaGlobal - valorArrecadado);
};

export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatarInteiro = (valor: number): string => {
  return valor.toLocaleString('pt-BR');
};
