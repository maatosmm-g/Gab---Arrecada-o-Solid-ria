import { Campaign, TransparencyItem } from './types';

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
  
  // Totais de prestação de contas na aba Transparência
  totalInvestidoTerapias: number;
  totalInvestidoTerapiasFormatado: string;
  totalCustosPlanejados: number;
  totalCustosPlanejadosFormatado: string;

  // Propriedades de sincronização com o painel de ajuste
  gastoTotalReal?: number;
  usandoFiltroGastoManual?: boolean;
  projecaoTotalReal?: number;
  usandoFiltroProjecaoManual?: boolean;
}

/**
 * Cria a estrutura baseada no objeto central "dadosDaCampanha" contendo
 * todas as propriedades estáticas e calculadas referentes aos valores da campanha.
 */
export function obterDadosDaCampanha(campaign: Campaign, transparencyItems?: TransparencyItem[]): CampaignDataSummary {
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

  // Calcular Investido em Terapias (Pago)
  let totalInvestidoTerapias = 0;
  if (campaign.useOverrideTotalSpent && campaign.overrideTotalSpent !== undefined && campaign.overrideTotalSpent >= 0) {
    totalInvestidoTerapias = campaign.overrideTotalSpent;
  } else if (transparencyItems) {
    totalInvestidoTerapias = transparencyItems
      .filter((it) => it.status === 'pago')
      .reduce((sum, it) => sum + it.amount, 0);
  }

  // Calcular Custos Futuros Planejados
  let totalCustosPlanejados = 0;
  if (campaign.useOverrideTotalForecast && campaign.overrideTotalForecast !== undefined && campaign.overrideTotalForecast >= 0) {
    totalCustosPlanejados = campaign.overrideTotalForecast;
  } else if (transparencyItems) {
    totalCustosPlanejados = transparencyItems
      .filter((it) => it.status !== 'pago')
      .reduce((sum, it) => sum + it.amount, 0);
  }

  // Formatações decimais em português (pt-BR)
  const valorArrecadadoFormatado = valorArrecadado.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  const metaGlobalFormatada = metaGlobal.toLocaleString('pt-BR');
  const valorRestanteFormatado = valorRestante.toLocaleString('pt-BR');
  
  const totalInvestidoTerapiasFormatado = totalInvestidoTerapias.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const totalCustosPlanejadosFormatado = totalCustosPlanejados.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return {
    metaGlobal,
    valorArrecadado,
    apoiadores,
    progressoPorcentagem,
    progressoPorcentagemAjustada,
    valorRestante,
    valorArrecadadoFormatado,
    metaGlobalFormatada,
    valorRestanteFormatado,
    totalInvestidoTerapias,
    totalInvestidoTerapiasFormatado,
    totalCustosPlanejados,
    totalCustosPlanejadosFormatado,
    gastoTotalReal: campaign.overrideTotalSpent,
    usandoFiltroGastoManual: campaign.useOverrideTotalSpent,
    projecaoTotalReal: campaign.overrideTotalForecast,
    usandoFiltroProjecaoManual: campaign.useOverrideTotalForecast
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
