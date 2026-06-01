import React, { useState, useEffect } from 'react';
import { initialCampaign, initialTransparency, initialUpdates, initialMedicalReports, defaultPINConfig, initialContributors, initialProducts } from './mockData';
import { Campaign, TransparencyItem, UpdateItem, MedicalReport, PINConfig, Contributor, ShopProduct } from './types';
import PINPanel from './components/PINPanel';
import { obterDadosDaCampanha, CampaignDataSummary } from './campanhaConfig';
import { buscarResumoDaCampanha, getSupabaseDiagnostics, oUltimoErroDeConectar } from './supabaseService';
import DonationModal from './components/DonationModal';
import TabStory from './components/TabStory';
import TabTransparency from './components/TabTransparency';
import TabTimeline from './components/TabTimeline';
import TabReports from './components/TabReports';
import TabShop from './components/TabShop';
import ImageUploadPicker from './components/ImageUploadPicker';
import VideoUploadPicker from './components/VideoUploadPicker';
import { 
  Heart, Shield, Sparkles, Award, Eye, Share2, MessageCircle, 
  CheckCircle2, FileText, Activity, AlertCircle, RefreshCw, Layers,
  Phone, Edit2, Save, Plus, Trash2, Video, Film, Play, ShoppingBag
} from 'lucide-react';

export default function App() {
  // Lendo e mantendo estados completos do LocalStorage para permitir persistência total de edições
  const [campaign, setCampaign] = useState<Campaign>(() => {
    const saved = localStorage.getItem('solidary_campaign');
    return saved ? JSON.parse(saved) : initialCampaign;
  });

  const [transparency, setTransparency] = useState<TransparencyItem[]>(() => {
    const saved = localStorage.getItem('solidary_transparency');
    return saved ? JSON.parse(saved) : initialTransparency;
  });

  const [updates, setUpdates] = useState<UpdateItem[]>(() => {
    const saved = localStorage.getItem('solidary_updates');
    return saved ? JSON.parse(saved) : initialUpdates;
  });

  const [reports, setReports] = useState<MedicalReport[]>(() => {
    const saved = localStorage.getItem('solidary_reports');
    return saved ? JSON.parse(saved) : initialMedicalReports;
  });

  const [pinConfig, setPinConfig] = useState<PINConfig>(() => {
    const saved = localStorage.getItem('solidary_pin');
    return saved ? JSON.parse(saved) : defaultPINConfig;
  });

  const [contributors, setContributors] = useState<Contributor[]>(() => {
    const saved = localStorage.getItem('solidary_contributors');
    return saved ? JSON.parse(saved) : initialContributors;
  });

  const [products, setProducts] = useState<ShopProduct[]>(() => {
    const saved = localStorage.getItem('solidary_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Estado administrativo (Verificação via PIN)
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditingHero, setIsEditingHero] = useState(false);

  // Modo Simulação/Homologação vs Produção
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('solidary_simulation_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Estados para dados integrados do Supabase e diagnósticos de conexão
  const [dadosBanco, setDadosBanco] = useState<CampaignDataSummary | null>(null);
  const [diagnosticoSupabase, setDiagnosticoSupabase] = useState(() => getSupabaseDiagnostics());
  const [ultimoErroSupabase, setUltimoErroSupabase] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Efeito para carregar dados reais do Supabase na inicialização da página
  useEffect(() => {
    async function carregarDados() {
      try {
        const resumo = await buscarResumoDaCampanha();
        if (resumo) {
          setDadosBanco(resumo);
          
          // Sincroniza informações numéricas e travas manuais com o Supabase
          setCampaign(prev => ({
            ...prev,
            targetAmount: resumo.metaGlobal,
            raisedAmount: resumo.valorArrecadado,
            donorCount: resumo.apoiadores,
            
            // 🔥 Novas linhas adicionadas para sincronizar os ajustes dos 3 cards:
            overrideTotalSpent: resumo.gastoTotalReal,
            useOverrideTotalSpent: resumo.usandoFiltroGastoManual,
            overrideTotalForecast: resumo.projecaoTotalReal,
            useOverrideTotalForecast: resumo.usandoFiltroProjecaoManual
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
      } finally {
        setUltimoErroSupabase(oUltimoErroDeConectar());
        setDiagnosticoSupabase(getSupabaseDiagnostics());
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

  // Centralização de dados e engrenagens de cálculo matemático da campanha (com fallback integrado se dadosBanco for nulo)
  const dadosDaCampanha = dadosBanco || obterDadosDaCampanha(campaign, transparency);

  // Helper para converter link cru do YouTube ou Vimeo em Embed URL
  const getEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';
    if (rawUrl.startsWith('data:')) return '';

    try {
      // Regex robusto para YouTube (Shorts, watch, mobile, embed, youtu.be)
      const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = rawUrl.match(ytRegExp);

      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0&modestbranding=1`;
      }

      const url = new URL(rawUrl);
      // Caso de Vimeo
      if (url.hostname.includes('vimeo.com')) {
        const videoId = url.pathname.substring(1).split('?')[0];
        if (videoId && !isNaN(Number(videoId))) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }
    } catch (e) {
      if (rawUrl.trim().length === 11 && !rawUrl.includes('/') && !rawUrl.includes('.')) {
        return `https://www.youtube.com/embed/${rawUrl.trim()}?autoplay=0&rel=0&modestbranding=1`;
      }
    }
    return rawUrl;
  };

  // States para formulário de edição do Hero
  const [heroPatientName, setHeroPatientName] = useState('');
  const [heroBio, setHeroBio] = useState('');
  const [heroPrimaryImage, setHeroPrimaryImage] = useState('');
  const [heroPrimaryMediaType, setHeroPrimaryMediaType] = useState<'image' | 'video'>('image');
  const [heroPrimaryVideo, setHeroPrimaryVideo] = useState('');
  const [heroPixKey, setHeroPixKey] = useState('');
  const [heroWhatsappNumber, setHeroWhatsappNumber] = useState('');
  const [heroMiniCards, setHeroMiniCards] = useState<Array<{ id: string; label: string; value: string }>>([]);
  const [heroShortTermObjectives, setHeroShortTermObjectives] = useState('');
  const [heroShortTermFontSize, setHeroShortTermFontSize] = useState('text-xs');
  const [heroShortTermTextColor, setHeroShortTermTextColor] = useState('text-slate-800');
  const [heroShortTermFontWeight, setHeroShortTermFontWeight] = useState('font-medium');
  const [heroShortTermIsItalic, setHeroShortTermIsItalic] = useState(true);
  const [heroShortTermBgColor, setHeroShortTermBgColor] = useState('bg-[#FCFAF2]/80');

  const startEditingHero = () => {
    setHeroPatientName(campaign.patientName);
    setHeroBio(campaign.bio || '');
    setHeroPrimaryImage(campaign.primaryImage || '');
    setHeroPrimaryMediaType(campaign.primaryMediaType || 'image');
    setHeroPrimaryVideo(campaign.primaryVideo || '');
    setHeroPixKey(campaign.pixKey || '');
    setHeroWhatsappNumber(campaign.whatsappNumber || '');
    setHeroMiniCards(campaign.miniCards ? [...campaign.miniCards] : []);
    setHeroShortTermObjectives(campaign.shortTermObjectives || '');
    setHeroShortTermFontSize(campaign.shortTermFontSize || 'text-xs');
    setHeroShortTermTextColor(campaign.shortTermTextColor || 'text-slate-800');
    setHeroShortTermFontWeight(campaign.shortTermFontWeight || 'font-medium');
    setHeroShortTermIsItalic(campaign.shortTermIsItalic !== undefined ? campaign.shortTermIsItalic : true);
    setHeroShortTermBgColor(campaign.shortTermBgColor || 'bg-[#FCFAF2]/80');
    setIsEditingHero(true);
  };

  const saveHeroChanges = () => {
    setCampaign({
      ...campaign,
      patientName: heroPatientName,
      bio: heroBio,
      primaryImage: heroPrimaryImage,
      primaryMediaType: heroPrimaryMediaType,
      primaryVideo: heroPrimaryVideo,
      pixKey: heroPixKey,
      whatsappNumber: heroWhatsappNumber,
      miniCards: heroMiniCards,
      shortTermObjectives: heroShortTermObjectives,
      shortTermFontSize: heroShortTermFontSize,
      shortTermTextColor: heroShortTermTextColor,
      shortTermFontWeight: heroShortTermFontWeight,
      shortTermIsItalic: heroShortTermIsItalic,
      shortTermBgColor: heroShortTermBgColor,
    });
    setIsEditingHero(false);
    setLastDonationAlert("Apresentação e mini cards salvos!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  // Modal de Doações e Mensagens auxiliares
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [lastDonationAlert, setLastDonationAlert] = useState<string | null>(null);

  // Aba selecionada
  const [activeTab, setActiveTab] = useState<'sobre' | 'transparencia' | 'diario' | 'laudos' | 'lojinha'>('sobre');

  // Efeitos para Gravação no LocalStorage sempre que houver modificações (Adição, Edição ou Exclusão)
  useEffect(() => {
    localStorage.setItem('solidary_campaign', JSON.stringify(campaign));
  }, [campaign]);

  useEffect(() => {
    localStorage.setItem('solidary_transparency', JSON.stringify(transparency));
  }, [transparency]);

  useEffect(() => {
    localStorage.setItem('solidary_updates', JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    localStorage.setItem('solidary_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('solidary_pin', JSON.stringify(pinConfig));
  }, [pinConfig]);

  useEffect(() => {
    localStorage.setItem('solidary_contributors', JSON.stringify(contributors));
  }, [contributors]);

  useEffect(() => {
    localStorage.setItem('solidary_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('solidary_simulation_mode', String(isSimulationMode));
  }, [isSimulationMode]);

  // Handlers para ações administrativas em cascata
  const handleUpdatePIN = (newPin: string) => {
    setPinConfig({
      ...pinConfig,
      currentPIN: newPin,
    });
  };

  const handleUpdateCampaign = (updated: Campaign) => {
    setCampaign(updated);
    setLastDonationAlert("Informações básicas da campanha atualizadas com sucesso!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleAddExpense = (item: TransparencyItem) => {
    setTransparency([item, ...transparency]);
    setLastDonationAlert("Novo lançamento de prestação de contas adicionado!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleUpdateExpense = (item: TransparencyItem) => {
    setTransparency(transparency.map((it) => (it.id === item.id ? item : it)));
    setLastDonationAlert("Lançamento financeiro editado e salvo!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleDeleteExpense = (id: string) => {
    setTransparency(transparency.filter((it) => it.id !== id));
    setLastDonationAlert("Lançamento deletado com sucesso.");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleAddUpdate = (item: UpdateItem) => {
    setUpdates([item, ...updates]);
    setLastDonationAlert("Nova notícia registrada com sucesso na timeline!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleUpdateUpdate = (item: UpdateItem) => {
    setUpdates(updates.map((it) => (it.id === item.id ? item : it)));
    setLastDonationAlert("Notícia do diário editada e salva!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleDeleteUpdate = (id: string) => {
    setUpdates(updates.filter((it) => it.id !== id));
    setLastDonationAlert("Notícia excluída.");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleAddReport = (report: MedicalReport) => {
    setReports([report, ...reports]);
    setLastDonationAlert("Novo laudo médico anexado com sucesso!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleUpdateReport = (report: MedicalReport) => {
    setReports(reports.map((it) => (it.id === report.id ? report : it)));
    setLastDonationAlert("Parâmetros do laudo clínico atualizados!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((it) => it.id !== id));
    setLastDonationAlert("Laudo médico removido do dossiê.");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleAddProduct = (item: ShopProduct) => {
    setProducts([item, ...products]);
    setLastDonationAlert("Novo item adicionado à lojinha da campanha!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleUpdateProduct = (item: ShopProduct) => {
    setProducts(products.map((it) => (it.id === item.id ? item : it)));
    setLastDonationAlert("Item da lojinha editado e atualizado!");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((it) => it.id !== id));
    setLastDonationAlert("Item removido da lojinha.");
    setTimeout(() => setLastDonationAlert(null), 3000);
  };

  // Processamento de transação vindo do Checkout
  const handleSuccessPay = (amount: number, isRecurring: boolean, name?: string, message?: string) => {
    // Altera o montante arrecadado e o número de doadores na campanha
    setCampaign(prev => ({
      ...prev,
      raisedAmount: prev.raisedAmount + amount,
      donorCount: prev.donorCount + 1,
    }));

    // Adiciona o doador na lista de contribuidores
    const newContributor: Contributor = {
      id: `cont-${Date.now()}`,
      name: name?.trim() || "Apoiador Anônimo",
      amount,
      date: new Date().toISOString().split('T')[0],
      isRecurring,
      message: message?.trim() || "Apoiou a jornada do Gabriel!",
    };
    setContributors(prev => [newContributor, ...prev]);

    // Registra uma notificação no topo
    setLastDonationAlert(`Doação Solidária de R$ ${amount.toLocaleString('pt-BR')} via ${isRecurring ? 'Aparato Recorrente' : 'PIX'} confirmada!`);
    setTimeout(() => setLastDonationAlert(null), 5000);
  };

  // Resetar dados para o padrão em caso de testes
  const handleResetStorage = () => {
    localStorage.removeItem('solidary_campaign');
    localStorage.removeItem('solidary_transparency');
    localStorage.removeItem('solidary_updates');
    localStorage.removeItem('solidary_reports');
    localStorage.removeItem('solidary_pin');
    localStorage.removeItem('solidary_contributors');
    localStorage.removeItem('solidary_products');
    localStorage.removeItem('solidary_simulation_mode');
    
    setCampaign(initialCampaign);
    setTransparency(initialTransparency);
    setUpdates(initialUpdates);
    setReports(initialMedicalReports);
    setPinConfig(defaultPINConfig);
    setContributors(initialContributors);
    setProducts(initialProducts);
    setIsSimulationMode(true);
    setIsAdmin(false);

    setLastDonationAlert("Todos os dados foram resetados com sucesso para os valores padrão!");
    setTimeout(() => setLastDonationAlert(null), 3000);
    setShowResetConfirm(false);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex flex-col items-center justify-center p-6" id="loading-screen">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-[#F27D26] animate-spin" />
          <p className="text-sm font-sans font-medium text-slate-600 animate-pulse">
            Carregando dados da campanha...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-natural-bg font-sans text-natural-dark antialiased" id="main-application-view">
      
      {/* ⚠️ TARGET BANNER - MODO ADMINISTRADOR ATIVO */}
      {isAdmin && (
        <div className="sticky top-0 z-30 bg-natural-primary text-white text-xs py-2 px-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-2.5" id="admin-sticky-banner">
          <div className="flex items-center gap-2 justify-center">
            <span className="h-2 w-2 rounded-full bg-white animate-ping shrink-0" />
            <span>MODO ORGANIZADOR ATIVO: Você desbloqueou painéis de digitação e edição em todas as abas.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSimulationMode(!isSimulationMode)}
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                isSimulationMode
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
              title="Alternar entre exibir ferramentas de teste (Simulação) ou layout limpo de Produção final"
            >
              {isSimulationMode ? '🛠️ Simulação Ativa' : '🚀 Produção Ativa'}
            </button>
            <button 
              onClick={() => setIsAdmin(false)}
              className="text-[10px] bg-natural-primary-dark hover:opacity-90 px-2.5 py-1 rounded text-white cursor-pointer font-bold"
            >
              Bloquear Painel
            </button>
          </div>
        </div>
      )}

      {/* 📊 NOTIFICATION PROMPTS */}
      {lastDonationAlert && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg bg-natural-dark text-white rounded-xl shadow-lg p-3 text-xs border border-natural-border flex items-center gap-2 animate-bounce justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lastDonationAlert}</span>
          </div>
          <button onClick={() => setLastDonationAlert(null)} className="text-white hover:text-slate-350 text-[11px] font-bold">X</button>
        </div>
      )}

      {/* 🏛️ BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className="bg-white border-b border-natural-border sticky top-0 md:relative z-20" id="main-navigation-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Solidário */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-natural-primary rounded-full flex items-center justify-center text-white">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="block text-xs font-bold text-natural-primary font-mono tracking-widest leading-none">ABRAÇO SOLIDÁRIO</span>
              <span className="text-sm font-extrabold font-display text-natural-dark leading-none">Canal do Gabriel</span>
            </div>
          </div>

          {/* Área do PIN Panel & Avatar (Controle do Administrador) */}
          <div className="flex items-center gap-3">
            <PINPanel 
              isAdmin={isAdmin} 
              setIsAdmin={setIsAdmin} 
              pinConfig={pinConfig} 
              onUpdatePIN={handleUpdatePIN} 
            />
          </div>

        </div>
      </nav>

      {/* 🌟 CONTAINER DO CORPO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {isAdmin && (
          <div className="flex justify-end pr-1" id="admin-mode-toggle-bar">
            <button
              onClick={() => {
                if (isEditingHero) {
                  setIsEditingHero(false);
                } else {
                  startEditingHero();
                }
              }}
              className="px-4 py-2 bg-natural-primary hover:bg-natural-primary/95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer focus:outline-none"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditingHero ? 'Visualizar Apresentação' : 'Painel: Editar Apresentação, Pix, Whats & Mini Cards'}
            </button>
          </div>
        )}
        
        {isEditingHero ? (
          <div className="bg-[#FAF9F6] rounded-3xl border-2 border-natural-primary p-6 sm:p-8 space-y-6 animate-fadeIn shadow-sm" id="hero-campaign-editor-workspace">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-natural-border pb-4 gap-3">
              <div>
                <h3 className="font-serif italic text-lg font-bold text-natural-dark flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-natural-primary animate-pulse" />
                  Modo Editor: Apresentação da Campanha
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Altere dados do beneficiário, banner, contatos e tags rápidas (mini cards).</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingHero(false)}
                  className="px-3.5 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveHeroChanges}
                  className="px-4 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Salvar Tudo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna 1 - Detalhes textuais */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#444430] mb-1">Nome do Beneficiário</label>
                  <input
                    type="text"
                    required
                    className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs outline-none focus:border-natural-primary font-semibold text-slate-800"
                    placeholder="Nome completo..."
                    value={heroPatientName}
                    onChange={(e) => setHeroPatientName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444430] mb-1">Breve Resumo (Introdução de Campanha)</label>
                  <textarea
                    rows={3}
                    required
                    className="w-full p-3 bg-white border border-natural-border rounded-xl text-xs outline-none focus:border-natural-primary leading-relaxed text-slate-650"
                    placeholder="Introdução rápida e marcante..."
                    value={heroBio}
                    onChange={(e) => setHeroBio(e.target.value)}
                  />
                </div>

                <div className="bg-white border border-natural-border rounded-2xl p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-1 text-natural-primary">
                    <Sparkles className="w-4 h-4 text-[#F27D26]" />
                    <span className="block text-xs font-bold uppercase tracking-wide">Espaço em Branco: Objetivos de Curto Prazo</span>
                  </div>
                  
                  {/* Barra de Ferramentas de Estilo */}
                  <div className="flex flex-wrap items-center gap-2 p-2 bg-natural-light/80 border border-natural-border/50 rounded-xl text-xs">
                    {/* Font Size */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500 font-bold">Fonte:</span>
                      <select
                        className="bg-white border border-natural-border rounded px-1.5 h-6 text-[10px] font-semibold"
                        value={heroShortTermFontSize}
                        onChange={(e) => setHeroShortTermFontSize(e.target.value)}
                      >
                        <option value="text-xs">Pequeno (xs)</option>
                        <option value="text-sm">Médio (sm)</option>
                        <option value="text-base">Médio-Grande (base)</option>
                        <option value="text-lg">Grande (lg)</option>
                      </select>
                    </div>

                    {/* Font Weight */}
                    <div className="flex items-center gap-1 border-l border-natural-border/60 pl-2">
                      <span className="text-[10px] text-slate-500 font-bold">Peso:</span>
                      <select
                        className="bg-white border border-natural-border rounded px-1.5 h-6 text-[10px] font-semibold"
                        value={heroShortTermFontWeight}
                        onChange={(e) => setHeroShortTermFontWeight(e.target.value)}
                      >
                        <option value="font-normal">Fina (normal)</option>
                        <option value="font-medium">Média (medium)</option>
                        <option value="font-semibold">Semi-Negrito (semibold)</option>
                        <option value="font-bold">Negrito (bold)</option>
                      </select>
                    </div>

                    {/* Text Color Presets */}
                    <div className="flex items-center gap-1 border-l border-natural-border/60 pl-2">
                      <span className="text-[10px] text-slate-500 font-bold">Cor:</span>
                      <select
                        className="bg-white border border-natural-border rounded px-1.5 h-6 text-[10px] font-semibold"
                        value={heroShortTermTextColor}
                        onChange={(e) => setHeroShortTermTextColor(e.target.value)}
                      >
                        <option value="text-slate-800">Cinza Escuro</option>
                        <option value="text-[#5A5A40]">Verde Oliva</option>
                        <option value="text-[#F27D26]">Laranja Alerta</option>
                        <option value="text-blue-600">Azul Sereno</option>
                        <option value="text-emerald-700">Verde Saúde</option>
                      </select>
                    </div>

                    {/* Background Color Presets */}
                    <div className="flex items-center gap-1 border-l border-natural-border/60 pl-2">
                      <span className="text-[10px] text-slate-500 font-bold">Fundo:</span>
                      <select
                        className="bg-white border border-natural-border rounded px-1.5 h-6 text-[10px] font-semibold"
                        value={heroShortTermBgColor}
                        onChange={(e) => setHeroShortTermBgColor(e.target.value)}
                      >
                        <option value="bg-[#FCFAF2]/80">Creme Suave</option>
                        <option value="bg-amber-50/50">Bege Amanteigado</option>
                        <option value="bg-rose-50/40">Rosa Suave</option>
                        <option value="bg-blue-50/50">Celeste</option>
                        <option value="bg-emerald-50/40">Menta Claro</option>
                        <option value="bg-transparent border border-dashed border-natural-border/70">Ocultar Caixa</option>
                      </select>
                    </div>

                    {/* Italic Toggle */}
                    <button
                      type="button"
                      onClick={() => setHeroShortTermIsItalic(prev => !prev)}
                      className={`h-6 px-2 rounded font-serif italic text-xs font-bold border transition-colors cursor-pointer ${
                        heroShortTermIsItalic
                          ? 'bg-natural-primary border-natural-primary/30 text-white'
                          : 'bg-white border-natural-border text-slate-705 hover:bg-slate-50'
                      }`}
                    >
                      Itálico
                    </button>
                  </div>

                  <label className="block text-[10px] font-semibold text-slate-550">Conteúdo dos Objetivos de Curto Prazo:</label>
                  <textarea
                    rows={4}
                    className="w-full p-3 bg-slate-50 border border-natural-border rounded-xl text-xs outline-none focus:border-natural-primary leading-relaxed text-slate-800 font-sans"
                    placeholder="Escreva os objetivos de curto prazo aqui..."
                    value={heroShortTermObjectives}
                    onChange={(e) => setHeroShortTermObjectives(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 italic">Dica: Adicione pontos utilizando o marcador '•' ou '-' para listar os objetivos.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#444430] mb-1">Chave PIX Solidário</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs outline-none focus:border-natural-primary font-mono text-slate-700"
                      placeholder="E-mail, CPF, celular ou PIX copia/cola"
                      value={heroPixKey}
                      onChange={(e) => setHeroPixKey(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#444430] mb-1">WhatsApp de Contato (Celular)</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs outline-none focus:border-natural-primary font-mono text-slate-700"
                      placeholder="Ex: 51999999999 (somente números)"
                      value={heroWhatsappNumber}
                      onChange={(e) => setHeroWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>

                {/* Modo Produção / Simulação Toggle */}
                <div className="p-3 bg-white border border-natural-border rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-natural-dark block">Modo de Simulação (Testes PIX / Cartão)</span>
                    <span className="text-[9.5px] text-slate-500 leading-snug block">Habilita botões e dicas de teste de transações na janela de Doação. Desative para simular a visualização de Produção final.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSimulationMode(!isSimulationMode)}
                    className={`h-7 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                      isSimulationMode
                        ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-150'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-250 hover:bg-emerald-150'
                    }`}
                  >
                    {isSimulationMode ? 'Simulação Ativa 🛠️' : 'Produção Real 🚀'}
                  </button>
                </div>

              </div>

              {/* Coluna 2 - Banner e Mini-Cards */}
              <div className="space-y-4">
                <div className="space-y-3 p-4 bg-white border border-natural-border/60 rounded-2xl shadow-2xs">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-natural-dark">Tipo de Mídia Principal do Banner</span>
                    <p className="text-[10px] text-slate-500">Escolha se o topo da página exibirá uma foto de destaque ou um vídeo de apresentação.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                     <button
                       type="button"
                       onClick={() => setHeroPrimaryMediaType('image')}
                       className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                         heroPrimaryMediaType === 'image'
                           ? 'bg-white text-natural-primary shadow-xs'
                           : 'text-slate-500 hover:text-slate-800'
                       }`}
                     >
                       <Layers className="w-3.5 h-3.5" /> Foto Destacada
                     </button>
                     <button
                       type="button"
                       onClick={() => setHeroPrimaryMediaType('video')}
                       className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                         heroPrimaryMediaType === 'video'
                           ? 'bg-white text-natural-accent shadow-xs'
                           : 'text-slate-500 hover:text-slate-800'
                       }`}
                     >
                       <Video className="w-3.5 h-3.5 text-natural-accent" /> Vídeo Destacado
                     </button>
                  </div>

                  {heroPrimaryMediaType === 'image' ? (
                    <div className="pt-2 animate-fadeIn">
                      <ImageUploadPicker
                        label="Imagem Principal do Banner (Drag-Drop ou Ctrl + V para colar)"
                        value={heroPrimaryImage}
                        onChange={setHeroPrimaryImage}
                      />
                    </div>
                  ) : (
                    <div className="pt-2 animate-fadeIn">
                      <VideoUploadPicker
                        value={heroPrimaryVideo}
                        onChange={setHeroPrimaryVideo}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-[#444430]">Mini Cards de Diagnóstico do Banner</label>
                    <button
                      type="button"
                      onClick={() => setHeroMiniCards([...heroMiniCards, { id: 'mc-' + Date.now(), label: '', value: '' }])}
                      className="h-7 px-2.5 bg-natural-light border border-natural-border hover:bg-natural-border/35 rounded-lg text-[10px] font-bold text-natural-primary flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" /> Incluir Mini Card
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {heroMiniCards.length === 0 ? (
                      <div className="sm:col-span-2 border border-dashed border-natural-border text-center py-4 rounded-xl text-[11px] text-slate-400 bg-white">
                        Nenhum mini card cadastrado. Clique em "Incluir Mini Card".
                      </div>
                    ) : (
                      heroMiniCards.map((card, index) => (
                        <div key={card.id} className="flex gap-1.5 items-center bg-white p-2 rounded-xl border border-natural-border">
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              required
                              placeholder="Rótulo (ex: Urgência)"
                              className="w-full h-6 px-2 bg-[#FAF9F6] border border-natural-border rounded-md text-[10px] font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-natural-primary"
                              value={card.label}
                              onChange={(e) => {
                                const updated = [...heroMiniCards];
                                updated[index].label = e.target.value;
                                setHeroMiniCards(updated);
                              }}
                            />
                            <input
                              type="text"
                              required
                              placeholder="Valor (ex: Imediata)"
                              className="w-full h-6 px-2 bg-[#FAF9F6] border border-natural-border rounded-md text-[10px] text-slate-600 placeholder-slate-400 outline-none focus:border-natural-primary font-medium"
                              value={card.value}
                              onChange={(e) => {
                                const updated = [...heroMiniCards];
                                updated[index].value = e.target.value;
                                setHeroMiniCards(updated);
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setHeroMiniCards(heroMiniCards.filter((c) => c.id !== card.id))}
                            className="p-1 px-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0 self-center"
                            title="Remover Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-natural-border pt-4">
              <button
                type="button"
                onClick={() => setIsEditingHero(false)}
                className="px-4.5 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveHeroChanges}
                className="px-5 h-9 bg-natural-primary hover:bg-natural-primary-dark text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Salvar Alterações
              </button>
            </div>
          </div>
        ) : (
          /* HERO SECTION DE ENGAJAMENTO (HISTÓRIA + PROGRESSO) - VIEWER */
          <section className="bg-white rounded-3xl border border-natural-border overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12" id="hero-campaign-section">
            
            {/* Informações Centrais e Métricas de Arrecadação */}
            <div className="p-6 sm:p-10 lg:col-span-12 xl:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Badges de Identidade */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-[#5A5A40] border border-natural-border inline-flex items-center gap-1">
                    <Shield className="w-3 h-3 text-natural-primary fill-natural-primary" /> Identidade Verificada
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-natural-light text-natural-primary border border-natural-border inline-flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Apoio de Longo Prazo
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                    Autismo & Inclusão
                  </span>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-serif italic text-natural-dark tracking-tight leading-tight">
                    {campaign.patientName}
                  </h1>
                  <p className="text-sm text-slate-500 font-medium max-w-xl italic">
                    {campaign.bio}
                  </p>
                </div>

                {/* Tabela rápida de diagnóstico para contextualização imediata */}
                {campaign.miniCards && campaign.miniCards.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl pt-2" id="display-mini-cards">
                    {campaign.miniCards.map((card) => (
                      <div key={card.id} className="bg-natural-light p-2.5 rounded-xl border border-natural-border text-xs text-slate-650 flex flex-col justify-between">
                        <span className="text-[10px] text-natural-primary block font-bold leading-none mb-1">{card.label}</span>
                        <span className="font-semibold text-natural-dark leading-snug">{card.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Objetivos de Curto Prazo (Preenchimento do espaço em branco) */}
                <div 
                  className={`p-4 rounded-2xl transition-all ${campaign.shortTermBgColor || 'bg-[#FCFAF2]/80'} border border-natural-border/60 max-w-xl mt-3`}
                  id="display-short-term-objectives"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4.5 h-4.5 text-[#F27D26]" />
                    <h4 className="text-[11px] font-sans font-bold uppercase text-natural-primary tracking-wide">
                      Objetivos de Curto Prazo
                    </h4>
                  </div>
                  <p 
                    className={`leading-relaxed whitespace-pre-line font-sans ${campaign.shortTermFontSize || 'text-xs'} ${campaign.shortTermTextColor || 'text-slate-800'} ${campaign.shortTermFontWeight || 'font-medium'} ${campaign.shortTermIsItalic ? 'italic' : ''}`}
                  >
                    {campaign.shortTermObjectives || "Defina seus objetivos de curto prazo no painel do organizador para preencher este espaço."}
                  </p>
                </div>
              </div>

              {/* Barra de Progresso Real e Estatísticas */}
              <div className="border-t border-natural-border pt-6 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider leading-none">Arrecadado (R$)</span>
                    <span className="text-lg sm:text-2xl font-serif font-bold italic text-natural-dark">
                      {dadosDaCampanha.valorArrecadadoFormatado}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider leading-none">Apoiadores</span>
                    <span className="text-lg sm:text-2xl font-serif font-bold italic text-natural-dark">
                      {dadosDaCampanha.apoiadores} pessoas
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider leading-none">Meta Global</span>
                    <span className="text-lg sm:text-2xl font-serif font-bold italic text-slate-400">
                      R$ {dadosDaCampanha.metaGlobalFormatada}
                    </span>
                  </div>
                </div>

                {/* Progressão de Barra */}
                <div>
                  <div className="w-full h-3.5 bg-natural-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-natural-primary rounded-full transition-all duration-1000"
                      style={{ width: `${dadosDaCampanha.progressoPorcentagem}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1.5 font-mono">
                    <span>{Math.round(dadosDaCampanha.progressoPorcentagem)}% Alcançados</span>
                    <span>Falta arrecadar R$ {dadosDaCampanha.valorRestanteFormatado}</span>
                  </div>
                </div>

                {/* Botões Chave de Conversão (Pilar 3) */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDonationOpen(true)}
                    className="h-12 px-8 rounded-full font-bold text-xs text-white bg-natural-accent hover:bg-natural-accent-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200/40 active:scale-98 cursor-pointer focus:outline-none"
                  >
                    <Heart className="w-4.5 h-4.5 fill-white animate-pulse" />
                    APOIAR AGORA (PIX OU CARTÃO)
                  </button>
                  {campaign.whatsappNumber && (
                    <a
                      href={`https://api.whatsapp.com/send?phone=${campaign.whatsappNumber}&text=${encodeURIComponent(`Olá! Gostaria de conversar sobre a campanha solidária do Gabriel.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-12 px-6 rounded-full font-semibold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <MessageCircle className="w-4.5 h-4.5 text-emerald-600 fill-emerald-600" />
                      Falar no WhatsApp
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const textShare = `Participe da rede de apoio do Gabriel Moraes Matos para manter os tratamentos neuropediátricos, TO e musicoterapia dele: ${window.location.href}`;
                      navigator.clipboard.writeText(textShare);
                      alert("Mensagem de apoio solidário copiada para a área de transferência! Compartilhe com amigos nas redes sociais.");
                    }}
                    className="h-12 px-6 rounded-full font-semibold text-xs text-natural-dark bg-[#FDFCFB] hover:bg-white border border-natural-border transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                  >
                    <Share2 className="w-4 h-4" />
                    Divulgar Campanha
                  </button>
                </div>

              </div>
            </div>

            {/* Banner Fotográfico/Vídeo Lateral (Estilo Menino dos Óculos Azuis) */}
            <div className="relative h-72 sm:h-96 lg:col-span-12 xl:col-span-5 lg:h-auto min-h-[320px] overflow-hidden bg-slate-950 flex items-center justify-center">
              {campaign.primaryMediaType === 'video' && campaign.primaryVideo ? (
                // PLAYER DE VÍDEO
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
                  {campaign.primaryVideo.startsWith('data:') ? (
                    <video 
                      src={campaign.primaryVideo} 
                      controls 
                      className="relative z-10 w-full h-full object-contain"
                      preload="metadata"
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(campaign.primaryVideo)}
                      title="Vídeo de Apresentação"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                  {/* Etiqueta indicando vídeo */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-2 py-0.5 rounded bg-natural-accent text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Play className="w-2.5 h-2.5 fill-white" /> Vídeo da Campanha
                    </span>
                  </div>
                </div>
              ) : (
                // EXIBIÇÃO DE IMAGEM TRADICIONAL
                <>
                  {/* Layer 1: Blurred background fallback */}
                  <img 
                    src={campaign.primaryImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"} 
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-lg opacity-40 select-none scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Layer 2: Foreground fitted beautifully */}
                  <img 
                    src={campaign.primaryImage || "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800"} 
                    alt="Gabriel Moraes Matos"
                    className="relative z-10 max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />
                  
                  {/* Legenda de foto de alto impacto emocional */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-[9px] font-bold uppercase tracking-wider">Foto do Beneficiário</span>
                    <p className="text-xs font-semibold leading-relaxed">
                      Gabriel em seu desenvolvimento. Seu foco preferido está em dedicação visual, leitura e ritmos sonoros na percussão.
                    </p>
                  </div>
                </>
              )}
            </div>

          </section>
        )}

        {/* 📑 NAVEGAÇÃO DOS QUATRO PILARES (ABAS EDITÁVEIS) */}
        <section className="space-y-5" id="social-ecosystem-tabs">
          <div className="border-b border-natural-border">
            <div className="flex overflow-x-auto gap-4 -mb-px pb-1 scrollbar-thin">
              
              <button
                onClick={() => setActiveTab('sobre')}
                className={`py-3 px-1 border-b-2 font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2 focus:outline-none cursor-pointer ${
                  activeTab === 'sobre'
                    ? 'border-natural-primary text-natural-primary'
                    : 'border-transparent text-slate-500 hover:text-natural-primary'
                }`}
              >
                <Award className="w-4 h-4" />
                1. Nossa História
              </button>

              <button
                onClick={() => setActiveTab('transparencia')}
                className={`py-3 px-1 border-b-2 font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2 focus:outline-none cursor-pointer ${
                  activeTab === 'transparencia'
                    ? 'border-natural-primary text-natural-primary'
                    : 'border-transparent text-slate-500 hover:text-natural-primary'
                }`}
              >
                <Layers className="w-4 h-4" />
                2. Transparência & Contas
              </button>

              <button
                onClick={() => setActiveTab('diario')}
                className={`py-3 px-1 border-b-2 font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2 focus:outline-none cursor-pointer ${
                  activeTab === 'diario'
                    ? 'border-natural-primary text-natural-primary'
                    : 'border-transparent text-slate-500 hover:text-natural-primary'
                }`}
              >
                <Activity className="w-4 h-4" />
                3. Diário de Evolução
              </button>

              <button
                onClick={() => setActiveTab('laudos')}
                className={`py-3 px-1 border-b-2 font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2 focus:outline-none cursor-pointer ${
                  activeTab === 'laudos'
                    ? 'border-natural-primary text-natural-primary'
                    : 'border-transparent text-slate-500 hover:text-natural-primary'
                }`}
              >
                <FileText className="w-4 h-4" />
                4. Relatórios Médicos ({reports.length})
              </button>

              <button
                onClick={() => setActiveTab('lojinha')}
                className={`py-3 px-1 border-b-2 font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2 focus:outline-none cursor-pointer ${
                  activeTab === 'lojinha'
                    ? 'border-natural-primary text-natural-primary'
                    : 'border-transparent text-slate-500 hover:text-natural-primary'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-natural-primary" />
                5. Produtos Solidários ({products.length})
              </button>

            </div>
          </div>

          {/* CONTEÚDO DIN MICO DAS ABAS CLARAMENTE DEFINIDAS */}
          <div className="bg-transparent" id="active-tab-content-render">
            {activeTab === 'sobre' && (
              <TabStory 
                campaign={campaign} 
                isAdmin={isAdmin} 
                onUpdateCampaign={handleUpdateCampaign} 
                contributors={contributors}
                onDeleteContributor={isAdmin ? (id: string) => {
                  const target = contributors.find(c => c.id === id);
                  if (target) {
                    setCampaign(prev => ({
                      ...prev,
                      raisedAmount: Math.max(0, prev.raisedAmount - target.amount),
                      donorCount: Math.max(0, prev.donorCount - 1),
                    }));
                  }
                  setContributors(prev => prev.filter(c => c.id !== id));
                  setLastDonationAlert("Apoio removido.");
                  setTimeout(() => setLastDonationAlert(null), 3000);
                } : undefined}
                onAddContributor={isAdmin ? (newC: Contributor) => {
                  setContributors(prev => [newC, ...prev]);
                  setCampaign(prev => ({
                    ...prev,
                    raisedAmount: prev.raisedAmount + newC.amount,
                    donorCount: prev.donorCount + 1,
                  }));
                  setLastDonationAlert(`Apoiador "${newC.name}" cadastrado com sucesso.`);
                  setTimeout(() => setLastDonationAlert(null), 3000);
                } : undefined}
                onUpdateContributor={isAdmin ? (updatedC: Contributor) => {
                  const oldC = contributors.find(c => c.id === updatedC.id);
                  const diff = oldC ? (updatedC.amount - oldC.amount) : 0;
                  if (diff !== 0) {
                    setCampaign(prev => ({
                      ...prev,
                      raisedAmount: Math.max(0, prev.raisedAmount + diff),
                    }));
                  }
                  setContributors(prev => prev.map(c => c.id === updatedC.id ? updatedC : c));
                  setLastDonationAlert(`Dados do apoiador atualizados.`);
                  setTimeout(() => setLastDonationAlert(null), 3000);
                } : undefined}
              />
            )}

            {activeTab === 'transparencia' && (
              <TabTransparency 
                transparencyItems={transparency} 
                campaign={campaign} 
                isAdmin={isAdmin} 
                onAddExpense={handleAddExpense} 
                onUpdateExpense={handleUpdateExpense} 
                onDeleteExpense={handleDeleteExpense} 
                onUpdateCampaign={handleUpdateCampaign}
              />
            )}

            {activeTab === 'diario' && (
              <TabTimeline 
                updates={updates} 
                isAdmin={isAdmin} 
                onAddUpdate={handleAddUpdate} 
                onUpdateUpdate={handleUpdateUpdate} 
                onDeleteUpdate={handleDeleteUpdate} 
              />
            )}

            {activeTab === 'laudos' && (
              <TabReports 
                reports={reports} 
                isAdmin={isAdmin} 
                onAddReport={handleAddReport} 
                onUpdateReport={handleUpdateReport} 
                onDeleteReport={handleDeleteReport} 
              />
            )}

            {activeTab === 'lojinha' && (
              <TabShop
                products={products}
                isAdmin={isAdmin}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                whatsappContact={campaign.whatsappNumber}
              />
            )}
          </div>

        </section>

      </main>

      {/* 🧾 FOOTER DETAILED PROMPT DETAILS */}
      <footer className="bg-natural-dark text-white mt-12 py-10" id="application-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-natural-primary/30 pb-6">
            <div>
              <p className="font-serif italic font-extrabold text-white text-lg">Gabriel Moraes Matos</p>
              <p className="text-xs text-slate-350">Canal de Arrecadação de Inclusão, Musicoterapia e Multidisciplinas.</p>
            </div>
            
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs font-semibold px-4 h-8 bg-natural-primary hover:bg-natural-primary-dark rounded-lg text-white transition-colors cursor-pointer shrink-0"
                title="Restaura os valores originais da campanha e limpa o LocalStorage"
              >
                Restaurar Dados Originais
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700/60 rounded-xl p-2.5 shadow-md">
                <span className="text-[11px] text-amber-400 font-bold">Confirma o reset geral dos dados?</span>
                <button
                  onClick={handleResetStorage}
                  className="text-[10px] font-extrabold px-3 py-1.5 bg-rose-600 hover:bg-rose-700 rounded-lg text-white transition-colors cursor-pointer"
                >
                  Sim, Resetar!
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="text-[10px] font-extrabold px-3 py-1.5 bg-neutral-750 hover:bg-neutral-800 rounded-lg text-slate-300 transition-colors cursor-pointer border border-neutral-700"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between text-[11px] text-slate-400 gap-2">
            <span>© 2026 Plataforma Solidária de Impacto Social Integrado. Todos os direitos reservados.</span>
            <span className="font-mono">Desenvolvido sob o escopo estratégico para Gabriel Moraes Matos</span>
          </div>
        </div>
      </footer>

      {/* 🔒 MODELO DE PAGAMENTO INTEGRADO */}
      <DonationModal 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
        onSuccessPay={handleSuccessPay} 
        patientName={campaign.patientName} 
        pixKey={campaign.pixKey}
        isSimulationMode={isSimulationMode}
      />

    </div>
  );
}
