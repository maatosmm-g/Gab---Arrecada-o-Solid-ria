import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Campaign, Contributor } from '../types';
import { 
  Edit2, Save, MapPin, User, Calendar, Heart, Shield, 
  CheckCircle, Info, Plus, Trash2, Image as ImageIcon, Video, Play, Film
} from 'lucide-react';
import ImageUploadPicker from './ImageUploadPicker';
import VideoUploadPicker from './VideoUploadPicker';

interface TabStoryProps {
  campaign: Campaign;
  isAdmin: boolean;
  onUpdateCampaign: (updated: Campaign) => void;
  contributors?: Contributor[];
  onDeleteContributor?: (id: string) => void;
}

export default function TabStory({ 
  campaign, 
  isAdmin, 
  onUpdateCampaign,
  contributors = [],
  onDeleteContributor
}: TabStoryProps) {
  const [isEditing, setIsEditing] = useState(false);

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
  const [title, setTitle] = useState(campaign.title);
  const [bio, setBio] = useState(campaign.bio);
  const [detailedStory, setDetailedStory] = useState(campaign.detailedStory);
  const [motherName, setMotherName] = useState(campaign.motherName);
  const [location, setLocation] = useState(campaign.location);
  const [targetAmount, setTargetAmount] = useState(campaign.targetAmount);
  const [raisedAmount, setRaisedAmount] = useState(campaign.raisedAmount);
  const [recurrentTitle, setRecurrentTitle] = useState(campaign.recurrentTitle || "Por que a Recorrência é Vital?");
  const [recurrentDesc, setRecurrentDesc] = useState(campaign.recurrentDesc || "A fonoaudiologia, o neuropediatra e a terapia ocupacional sensorial não são pontuais — são tratamentos cumulativos e permanentes. Garantir uma base de apoiadores mensais protege a rotina do Gabriel de interrupções.");
  
  // Estados para Dossiê Dinâmico e Galeria de Mídias
  const [dossierCards, setDossierCards] = useState<Array<{ id: string; label: string; value: string }>>(() => {
    return campaign.dossierCards || [
      { id: "dc-1", label: "Beneficiário", value: campaign.patientName },
      { id: "dc-2", label: "Mãe / Administradora", value: campaign.motherName },
      { id: "dc-3", label: "Origem / Respeito", value: campaign.location },
      { id: "dc-4", label: "Status de Verificação", value: "Identidade Aprovada" }
    ];
  });

  const [mediaImages, setMediaImages] = useState<Array<{ id: string; url: string; caption: string; imageFit?: 'cover' | 'contain' }>>(() => {
    return campaign.images || [];
  });

  const [mediaVideos, setMediaVideos] = useState<Array<{ id: string; url: string; caption?: string }>>(() => {
    return campaign.videos || [];
  });

  const handleSave = () => {
    onUpdateCampaign({
      ...campaign,
      title,
      bio,
      detailedStory,
      motherName,
      location,
      targetAmount: Number(targetAmount),
      raisedAmount: Number(raisedAmount),
      dossierCards,
      images: mediaImages,
      videos: mediaVideos,
      recurrentTitle,
      recurrentDesc,
    });
    setIsEditing(false);
  };

  const handleAddDossierCard = () => {
    const newCard = {
      id: `dc-${Date.now()}`,
      label: 'Novo Campo',
      value: 'Valor correspondente'
    };
    setDossierCards([...dossierCards, newCard]);
  };

  const handleRemoveDossierCard = (id: string) => {
    setDossierCards(dossierCards.filter(c => c.id !== id));
  };

  const handleAddMediaImage = () => {
    const newImg = {
      id: `img-${Date.now()}`,
      url: '',
      caption: 'Escreva a legenda sobre este momento...',
      imageFit: 'cover' as const
    };
    setMediaImages([...mediaImages, newImg]);
  };

  const handleRemoveMediaImage = (id: string) => {
    setMediaImages(mediaImages.filter(img => img.id !== id));
  };

  const handleAddMediaVideo = () => {
    const newVid = {
      id: `vid-${Date.now()}`,
      url: '',
      caption: 'Insira uma descrição sobre este vídeo...'
    };
    setMediaVideos([...mediaVideos, newVid]);
  };

  const handleRemoveMediaVideo = (id: string) => {
    setMediaVideos(mediaVideos.filter(vid => vid.id !== id));
  };

  return (
    <div className="space-y-6" id="tab-story-view">
      {/* Indicador de Modo de Edição Ativo na Aba */}
      {isAdmin && !isEditing && (
        <div className="bg-natural-light border border-natural-border p-3 rounded-xl flex items-center justify-between text-xs text-natural-primary">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-natural-primary shrink-0" />
            <span>Deseja alterar a história detalhada, o dossiê do beneficiário ou a galeria de mídia da campanha?</span>
          </div>
          <button
            onClick={() => {
              // Sincronizar estados com os dados atuais salvos
              setTitle(campaign.title);
              setBio(campaign.bio);
              setDetailedStory(campaign.detailedStory);
              setMotherName(campaign.motherName);
              setLocation(campaign.location);
              setTargetAmount(campaign.targetAmount);
              setRaisedAmount(campaign.raisedAmount);
              setRecurrentTitle(campaign.recurrentTitle || "Por que a Recorrência é Vital?");
              setRecurrentDesc(campaign.recurrentDesc || "A fonoaudiologia, o neuropediatra e a terapia ocupacional sensorial não são pontuais — são tratamentos cumulativos e permanentes. Garantir uma base de apoiadores mensais protege a rotina do Gabriel de interrupções.");
              setDossierCards(campaign.dossierCards || dossierCards);
              setMediaImages(campaign.images || mediaImages);
              setMediaVideos(campaign.videos || []);
              setIsEditing(true);
            }}
            className="px-3.5 py-1.5 bg-natural-primary text-white rounded-lg font-bold hover:bg-natural-primary-dark transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer text-xs"
          >
            <Edit2 className="w-3.5 h-3.5" /> Painel de Edição da Aba
          </button>
        </div>
      )}

      {isEditing ? (
        /* FORMULÁRIO DE EDIÇÃO DE HISTÓRIA E CONFIGURAÇÕES DA CAMPANHA */
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FAF9F6] border border-natural-border rounded-2xl p-5 sm:p-7 space-y-6"
          id="edit-story-form"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-natural-border pb-3.5 gap-3">
            <div>
              <h3 className="font-serif italic font-bold text-natural-dark text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-natural-primary" />
                Painel da História, Dossiê e Galeria
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Gerencie os detalhes descritivos da causa e anexe fotos que demonstram avanços.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 h-8 rounded-lg bg-white border border-natural-border hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4.5 h-8 rounded-lg bg-natural-accent hover:bg-natural-accent-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Save className="w-4 h-4" /> Salvar Narrativa
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444430] mb-1">Título de Introdução da História</label>
              <input
                type="text"
                required
                className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs font-medium focus:border-natural-primary outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444430] mb-1">Meta Financeira Total (R$)</label>
              <input
                type="number"
                required
                className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs font-medium focus:border-natural-primary outline-none"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444430] mb-1">Valor Arrecadado Atual (R$)</label>
              <input
                type="number"
                required
                className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs font-medium focus:border-natural-primary outline-none"
                value={raisedAmount}
                onChange={(e) => setRaisedAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444430] mb-1">Nome da Mãe / Administradora</label>
              <input
                type="text"
                required
                className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs font-medium focus:border-natural-primary outline-none"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444430] mb-1">Cidade / Estado</label>
              <input
                type="text"
                required
                className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs font-medium focus:border-natural-primary outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#444430] mb-1">Breve Resumo Geral</label>
              <textarea
                rows={2}
                required
                className="w-full p-3 bg-white border border-natural-border rounded-xl text-xs font-medium focus:border-natural-primary outline-none leading-relaxed"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444430] mb-1">Texto de Storytelling Completo (Pilar 1)</label>
              <textarea
                rows={6}
                required
                className="w-full p-4 bg-white border border-natural-border rounded-xl text-xs font-medium focus:border-natural-primary leading-relaxed outline-none"
                value={detailedStory}
                onChange={(e) => setDetailedStory(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-natural-border/40 pt-4">
              <div>
                <label className="block text-xs font-semibold text-[#444430] mb-1">Título do Apoio de Longo Prazo (Card Recorrência)</label>
                <input
                  type="text"
                  required
                  className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs font-medium focus:border-natural-primary outline-none"
                  value={recurrentTitle}
                  onChange={(e) => setRecurrentTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#444430] mb-1">Texto explicativo (Card Recorrência)</label>
                <textarea
                  rows={2}
                  required
                  className="w-full p-3 bg-white border border-natural-border rounded-xl text-xs font-medium focus:border-natural-primary outline-none leading-relaxed"
                  value={recurrentDesc}
                  onChange={(e) => setRecurrentDesc(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* EDITOR DO DOSSIÊ DO BENEFICIÁRIO (MINI CARDS) */}
          <div className="border-t border-natural-border pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-natural-primary uppercase tracking-wider font-sans">Dossiê do Beneficário (Cards Editáveis)</h4>
                <p className="text-[10px] text-slate-500">Adicione ou reescreva as características oficiais exibidas na aba lateral.</p>
              </div>
              <button
                type="button"
                onClick={handleAddDossierCard}
                className="h-7 px-2.5 bg-natural-light border border-natural-border hover:bg-natural-border/30 rounded-lg text-[10px] font-bold text-natural-primary flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Mini Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {dossierCards.map((card, idx) => (
                <div key={card.id} className="flex gap-2 items-center bg-white p-2.5 rounded-xl border border-natural-border">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      className="w-full h-7 px-2 bg-slate-50 border border-natural-border rounded-md text-[10px] font-bold text-[#444430] outline-none focus:border-natural-primary"
                      placeholder="Identificação (Ex: Cidade)"
                      value={card.label}
                      onChange={(e) => {
                        const copy = [...dossierCards];
                        copy[idx].label = e.target.value;
                        setDossierCards(copy);
                      }}
                    />
                    <input
                      type="text"
                      className="w-full h-7 px-2 bg-slate-50 border border-natural-border rounded-md text-[10px] text-slate-600 outline-none focus:border-natural-primary"
                      placeholder="Valor ou descrição..."
                      value={card.value}
                      onChange={(e) => {
                        const copy = [...dossierCards];
                        copy[idx].value = e.target.value;
                        setDossierCards(copy);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDossierCard(card.id)}
                    className="p-1 px-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remover Mini Card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* EDITOR DA GALERIA DE MÍDIAS */}
          <div className="border-t border-natural-border pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-natural-primary uppercase tracking-wider font-sans">Galeria de Mídia (Momentos Reais e Integração)</h4>
                <p className="text-[10px] text-slate-500">Coloque fotos (Ctrl + V ou Drag-Drop) de terapias e momentos especiais com legados descritivos.</p>
              </div>
              <button
                type="button"
                onClick={handleAddMediaImage}
                className="h-8 px-3 bg-natural-light border border-natural-border hover:bg-natural-border/30 rounded-lg text-xs font-bold text-natural-primary flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Incluir Foto (+)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaImages.length === 0 ? (
                <div className="sm:col-span-2 border-2 border-dashed border-natural-border rounded-xl text-center py-8 text-xs text-slate-400 bg-white">
                  Nenhuma imagem na galeria. Clique no botão de mais (+) acima para inserir.
                </div>
              ) : (
                mediaImages.map((img, idx) => (
                  <div key={img.id} className="bg-white border border-natural-border rounded-xl p-3 space-y-3 shadow-xs">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="text-[10px] font-bold text-natural-primary font-mono lowercase">Mídia ID: #{img.id.slice(-4)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMediaImage(img.id)}
                        className="p-1 px-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-[10px] font-semibold flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> Excluir Mídia
                      </button>
                    </div>

                    <ImageUploadPicker
                      value={img.url}
                      onChange={(val) => {
                        const copy = [...mediaImages];
                        copy[idx].url = val;
                        setMediaImages(copy);
                      }}
                    />

                    {img.url && (
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Ajuste Inteligente da Imagem</label>
                        <select
                          className="w-full h-8 px-2 bg-slate-50 border border-natural-border rounded-lg text-[11px] outline-none focus:border-natural-primary font-medium focus:ring-1 focus:ring-natural-primary"
                          value={img.imageFit || 'cover'}
                          onChange={(e) => {
                            const copy = [...mediaImages];
                            copy[idx].imageFit = e.target.value as 'cover' | 'contain';
                            setMediaImages(copy);
                          }}
                        >
                          <option value="cover">Preencher / Recortar (Corta as bordas para preencher o banner)</option>
                          <option value="contain">Conter / Mostrar Inteira (Não corta a foto, usa fundo desfocado inteligente)</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Legenda / Transmissão do Momento</label>
                      <input
                        type="text"
                        className="w-full h-8 px-2 bg-slate-50 border border-natural-border rounded-lg text-[11px] outline-none focus:border-natural-primary font-medium"
                        placeholder="Insira detalhes e avanços do Gabriel..."
                        value={img.caption}
                        onChange={(e) => {
                          const copy = [...mediaImages];
                          copy[idx].caption = e.target.value;
                          setMediaImages(copy);
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* EDITOR DA GALERIA DE VÍDEOS */}
          <div className="border-t border-natural-border pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-natural-primary uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-natural-accent" />
                  Galeria de Vídeos (Testemunhos, Short Clips e Acompanhamentos)
                </h4>
                <p className="text-[10px] text-slate-500">Adicione vídeos de progresso do Gabriel usando links do YouTube (Shorts ou convencional) ou envie vídeos curtos locais.</p>
              </div>
              <button
                type="button"
                onClick={handleAddMediaVideo}
                className="h-8 px-3 bg-natural-light border border-natural-border hover:bg-natural-border/30 rounded-lg text-xs font-bold text-natural-primary flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Incluir Vídeo (+)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaVideos.length === 0 ? (
                <div className="sm:col-span-2 border-2 border-dashed border-natural-border rounded-xl text-center py-8 text-xs text-slate-400 bg-white">
                  Nenhum vídeo na galeria. Clique no botão de mais (+) acima para inserir.
                </div>
              ) : (
                mediaVideos.map((vid, idx) => (
                  <div key={vid.id} className="bg-white border border-natural-border rounded-xl p-3 space-y-3 shadow-xs">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="text-[10px] font-bold text-natural-primary font-mono lowercase">Vídeo ID: #{vid.id.slice(-4)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMediaVideo(vid.id)}
                        className="p-1 px-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-[10px] font-semibold flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> Excluir Vídeo
                      </button>
                    </div>

                    <VideoUploadPicker
                      value={vid.url}
                      onChange={(val) => {
                        const copy = [...mediaVideos];
                        copy[idx].url = val;
                        setMediaVideos(copy);
                      }}
                    />

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Legenda / Momento do Vídeo</label>
                      <input
                        type="text"
                        className="w-full h-8 px-2 bg-slate-50 border border-natural-border rounded-lg text-[11px] outline-none focus:border-natural-primary font-medium"
                        placeholder="Ex: Gabriel ensaiando para o samba..."
                        value={vid.caption || ''}
                        onChange={(e) => {
                          const copy = [...mediaVideos];
                          copy[idx].caption = e.target.value;
                          setMediaVideos(copy);
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-natural-border pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 h-9 rounded-lg bg-natural-primary hover:bg-natural-primary-dark text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle className="w-4 h-4" /> Salvar e Atualizar
            </button>
          </div>
        </motion.div>
      ) : (
        /* EXIBIÇÃO TRADICIONAL */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda: História Principal */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-natural-primary/10 text-natural-primary">
                História Principal - Caso Ativo
              </span>
              <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-natural-dark leading-tight">
                {campaign.title}
              </h2>
            </div>

            <p className="text-sm font-semibold text-natural-primary border-l-4 border-natural-primary pl-3 leading-relaxed py-1 italic">
              {campaign.bio}
            </p>

            <div className="whitespace-pre-line text-xs sm:text-sm text-slate-650 leading-relaxed space-y-4 font-sans">
              {campaign.detailedStory}
            </div>

            {/* Galeria de Fotos baseada nas fotos enviadas */}
            <div className="pt-4 space-y-3">
              <h3 className="font-serif italic font-bold text-sm text-natural-dark uppercase tracking-wider flex items-center gap-1 border-b border-natural-border pb-1">
                <ImageIcon className="w-4 h-4 text-natural-accent" />
                Momentos Reais e Integração (Galeria de Mídia)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(campaign.images || []).length === 0 ? (
                  <p className="sm:col-span-2 text-xs text-slate-400 italic">Nenhuma foto anexada a galeria de momentos.</p>
                ) : (
                  (campaign.images || []).map((img) => (
                    <div key={img.id} className="group overflow-hidden rounded-xl border border-natural-border bg-white shadow-xs">
                      <div className="h-40 w-full overflow-hidden bg-slate-50 relative flex items-center justify-center">
                        {img.url ? (
                          img.imageFit === 'contain' ? (
                            <>
                              <img
                                src={img.url}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 select-none scale-110 pointer-events-none"
                                referrerPolicy="no-referrer"
                              />
                              <img
                                src={img.url}
                                alt={img.caption}
                                className="relative z-10 max-w-full max-h-full object-contain p-1.5 transition-transform duration-350 group-hover:scale-103"
                                referrerPolicy="no-referrer"
                              />
                            </>
                          ) : (
                            <img
                              src={img.url}
                              alt={img.caption}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-350 group-hover:scale-103"
                              referrerPolicy="no-referrer"
                            />
                          )
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-200" />
                        )}
                      </div>
                      <div className="p-2.5 bg-natural-light">
                        <p className="text-[10px] text-slate-550 font-medium leading-relaxed">
                          {img.caption}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Galeria de Vídeos baseada nos vídeos enviados */}
            <div className="pt-6 space-y-3 animate-fadeIn" id="campanha-video-gallery">
              <h3 className="font-serif italic font-bold text-sm text-natural-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-natural-border pb-1">
                <Video className="w-4 h-4 text-natural-accent" />
                Registros em Vídeo (Acompanhamento e Treinos)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(!campaign.videos || campaign.videos.length === 0) ? (
                  <p className="sm:col-span-2 text-xs text-slate-400 italic">Nenhum vídeo anexado à galeria de momentos.</p>
                ) : (
                  campaign.videos.map((vid) => {
                    const embed = getEmbedUrl(vid.url);
                    const isBase64 = vid.url?.startsWith('data:');
                    
                    return (
                      <div key={vid.id} id={`vid-card-${vid.id}`} className="group overflow-hidden rounded-xl border border-natural-border bg-white shadow-xs">
                        <div className="aspect-video w-full bg-slate-950 relative flex items-center justify-center overflow-hidden">
                          {isBase64 ? (
                            <video
                              src={vid.url}
                              className="w-full h-full object-contain"
                              controls
                              preload="metadata"
                            />
                          ) : embed ? (
                            <div className="relative w-full h-full">
                              <iframe
                                src={embed}
                                title={vid.caption || "Acompanhamento em Vídeo"}
                                className="w-full h-full absolute inset-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <div className="p-4 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-full">
                              <Play className="w-8 h-8 text-natural-accent mb-2" />
                              <span>Vídeo não pôde ser reproduzido diretamente.</span>
                              <a href={vid.url} target="_blank" rel="noopener noreferrer" className="text-natural-primary underline mt-1 font-bold font-mono">
                                Assistir Externamente ↗
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-2.5 bg-natural-light border-t border-natural-border/30 flex flex-col justify-between gap-2">
                          {vid.caption && (
                            <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed italic">
                              "{vid.caption}"
                            </p>
                          )}
                          {!isBase64 && vid.url && (
                            <div className="flex justify-end pt-1">
                              <a
                                href={vid.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-natural-primary hover:text-natural-accent bg-white px-2.5 py-1 rounded-md border border-natural-border/55 hover:border-natural-accent transition-all cursor-pointer shadow-xs"
                              >
                                <Film className="w-3 h-3 text-natural-primary" /> Assistir no YouTube ↗
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Card de Detalhes de Ajuda e Dossiê */}
          <div className="space-y-4">
            <div className="bg-[#FDFCFB]/90 border border-natural-border rounded-2xl p-5 space-y-4">
              <h3 className="font-serif italic font-semibold text-xs text-[#5A5A40] uppercase tracking-wider border-b border-natural-border/60 pb-1.5">
                Dossiê do Beneficário
              </h3>

              <div className="space-y-3">
                {(campaign.dossierCards || dossierCards).map((card, idx) => {
                  return (
                    <div key={card.id || idx} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-natural-border/60 shadow-2xs">
                      <div className="p-1.5 bg-natural-light text-natural-primary rounded">
                        {card.label.toLowerCase().includes('mãe') || card.label.toLowerCase().includes('gestor') ? (
                          <Heart className="w-4 h-4 text-natural-accent fill-natural-accent/10" />
                        ) : card.label.toLowerCase().includes('origem') || card.label.toLowerCase().includes('cidade') ? (
                          <MapPin className="w-4 h-4 text-natural-primary" />
                        ) : card.label.toLowerCase().includes('status') || card.label.toLowerCase().includes('veri') ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <User className="w-4 h-4 text-natural-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">{card.label}</span>
                        {card.label.toLowerCase().includes('status') || card.label.toLowerCase().includes('veri') ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                            <Shield className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600/10 shrink-0" /> {card.value}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-natural-dark truncate block">{card.value}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informação do Pillar de Confiança */}
              <div className="p-3 bg-natural-light rounded-xl text-[11px] text-natural-primary border border-natural-border">
                <p className="font-bold mb-1 flex items-center gap-1 text-natural-primary/95">
                  <Shield className="w-3.5 h-3.5 text-natural-primary" /> Pilar do Cuidado e Transparência
                </p>
                Toda arrecadação é controlada via notas fiscais e relatórios médicos disponíveis na aba de <strong>Transparência</strong> e de <strong>Relatórios</strong>.
              </div>
            </div>

            {/* Metas adicionais ou informativos */}
            <div className="bg-natural-primary text-white rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5">
                <Heart className="w-48 h-48 fill-white" />
              </div>
              <p className="text-[10px] uppercase font-bold text-natural-accent tracking-wider">Apoio de Longo Prazo</p>
              <h4 className="font-serif italic font-semibold text-sm leading-snug">
                {campaign.recurrentTitle || "Por que a Recorrência é Vital?"}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {campaign.recurrentDesc || "A fonoaudiologia, o neuropediatra e a terapia ocupacional sensorial não são pontuais — são tratamentos cumulativos e permanentes. Garantir uma base de apoiadores mensais protege a rotina do Gabriel de interrupções."}
              </p>
            </div>

            {/* Últimos Contribuidores (Espaço ocupado abaixo do card) */}
            <div className="bg-white border border-natural-border rounded-2xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-natural-border/60 pb-2">
                <h3 className="font-serif italic font-semibold text-xs text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-natural-accent fill-natural-accent/10" />
                  Últimos Contribuidores
                </h3>
                <span className="text-[10px] bg-natural-light/70 text-natural-primary px-1.5 py-0.5 rounded-md font-bold font-mono">
                  Ativos 5
                </span>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                {(!contributors || contributors.length === 0) ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">Nenhuma contribuição listada até o momento.</p>
                ) : (
                  contributors.slice(0, 5).map((donor) => (
                    <div key={donor.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-natural-border/50 rounded-xl space-y-1.5 transition-all text-left relative group">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <span className="font-semibold text-xs text-natural-dark block truncate max-w-[145px]" title={donor.name}>
                            {donor.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium font-mono">
                            {new Date(donor.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-xs font-bold text-natural-primary font-mono leading-none">
                            R$ {donor.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          {donor.isRecurring ? (
                            <span className="text-[8px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 rounded font-bold uppercase tracking-wide mt-1 scale-90 origin-right shrink-0">
                              Mensal ⇄
                            </span>
                          ) : (
                            <span className="text-[8px] text-slate-500 bg-slate-100 px-1 rounded font-bold uppercase tracking-wide mt-1 scale-90 origin-right shrink-0">
                              Único
                            </span>
                          )}
                        </div>
                      </div>
                      {donor.message && (
                        <p className="text-[10.5px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100 font-sans leading-relaxed">
                          "{donor.message}"
                        </p>
                      )}

                      {/* Botão administrativo para remover contribuição incorreta */}
                      {isAdmin && onDeleteContributor && (
                        <button
                          onClick={() => {
                            if (confirm(`Remover contribuição de ${donor.name}?`)) {
                              onDeleteContributor(donor.id);
                            }
                          }}
                          className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-50 hover:bg-rose-100 text-rose-600 p-1 rounded border border-rose-200 cursor-pointer shadow-2xs"
                          title="Remover Registro de Doação (Admin)"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
