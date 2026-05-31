import { createClient } from '@supabase/supabase-js';
import { Campaign } from './types';
import { obterDadosDaCampanha, CampaignDataSummary } from './campanhaConfig';

// Inicializa o cliente de forma de carregamento preguiçoso (lazy execution) para evitar erro no carregamento do módulo
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Função auxiliar para validar se a URL é um endereço HTTP/HTTPS válido
function isValidHttpUrl(string: string) {
  if (!string) return false;
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

let lastConnectionError: string | null = null;

export const supabase = isValidHttpUrl(supabaseUrl) && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Retorna o último erro ocorrido na conexão ou consulta ao Supabase
 */
export function oUltimoErroDeConectar() {
  return lastConnectionError;
}

/**
 * Função de diagnóstico que informa o estado das variáveis de ambiente
 */
export function getSupabaseDiagnostics() {
  const url = supabaseUrl || '';
  const key = supabaseAnonKey || '';
  
  const hasUrl = !!url;
  const hasKey = !!key;
  const urlValid = isValidHttpUrl(url);
  const keyIsJWT = typeof key === 'string' && (key.includes('.') || key.startsWith('sb_')) && key.length >= 35;
  
  let status: 'OK' | 'MISSING_URL' | 'MISSING_KEY' | 'INVALID_URL' | 'KEY_IS_PROJECT_ID' | 'INVALID_KEY_FORMAT' = 'OK';
  
  if (!url) {
    status = 'MISSING_URL';
  } else if (!key) {
    status = 'MISSING_KEY';
  } else if (!urlValid) {
    status = 'INVALID_URL';
  } else if (!keyIsJWT) {
    if (key.length < 35 && !key.includes('.')) {
      status = 'KEY_IS_PROJECT_ID';
    } else {
      status = 'INVALID_KEY_FORMAT';
    }
  }

  return {
    status,
    hasUrl,
    hasKey,
    urlValid,
    keyIsJWT,
    urlValue: url ? (url.length > 25 ? `${url.substring(0, 22)}...` : url) : '',
    keyValue: key ? (key.length > 15 ? `${key.substring(0, 12)}...` : key) : '',
  };
}

/**
 * Função que busca os dados reais do banco e já entrega os cálculos prontos
 */
export async function buscarResumoDaCampanha(): Promise<CampaignDataSummary | null> {
  try {
    if (!supabase) {
      if (!isValidHttpUrl(supabaseUrl)) {
        lastConnectionError = 'URL do Supabase inválida ou ausente';
      } else if (!supabaseAnonKey) {
        lastConnectionError = 'Chave anônima (VITE_SUPABASE_ANON_KEY) ausente';
      } else {
        lastConnectionError = 'Supabase não inicializado';
      }
      console.warn('Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente.');
      return null;
    }

    // Busca a única linha de configuração na tabela que criamos no Supabase
    const { data, error } = await supabase
      .from('campanha_config')
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao buscar dados do Supabase:', error.message);
      lastConnectionError = error.message;
      return null;
    }

    // Sucesso, limpamos o último erro
    lastConnectionError = null;

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
    } as Campaign;

    // Passa os dados pelo cérebro financeiro (seu campanhaConfig.ts) para gerar porcentagens e moedas formatadas
    return obterDadosDaCampanha(dadosFormatados);
  } catch (err: any) {
    console.error('Erro crítico no serviço de dados:', err);
    lastConnectionError = err?.message || String(err);
    return null;
  }
}
