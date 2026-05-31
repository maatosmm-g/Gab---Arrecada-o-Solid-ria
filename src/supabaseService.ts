import { createClient } from '@supabase/supabase-js';
import { Campaign } from './types';
import { obterDadosDaCampanha, CampaignDataSummary } from './campanhaConfig';

// Inicializa o cliente com as chaves que configuramos na Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Função que busca os dados reais do banco e já entrega os cálculos prontos
 */
export async function buscarResumoDaCampanha(): Promise<CampaignDataSummary | null> {
  try {
    // Busca a única linha de configuração na tabela que criamos no Supabase
    const { data, error } = await supabase
      .from('campanha_config')
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao buscar dados do Supabase:', error.message);
      return null;
    }

    if (!data) return null;

    // Converte os nomes do banco (snake_case) para o formato esperado pelo seu types.ts (camelCase)
    const dadosFormatados: Campaign = {
      targetAmount: Number(data.target_amount),
      raisedAmount: Number(data.raised_amount),
      donorCount: Number(data.donor_count),
      overrideTotalSpent: data.override_total_spent ? Number(data.override_total_spent) : undefined,
      useOverrideTotalSpent: data.use_override_total_spent,
      overrideTotalForecast: data.override_total_forecast ? Number(data.override_total_forecast) : undefined,
      useOverrideTotalForecast: data.use_override_total_forecast,
    };

    // Passa os dados pelo cérebro financeiro (seu campanhaConfig.ts) para gerar porcentagens e moedas formatadas
    return obterDadosDaCampanha(dadosFormatados);
  } catch (err) {
    console.error('Erro crítico no serviço de dados:', err);
    return null;
  }
}
