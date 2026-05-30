import React, { useState } from 'react';
import { UpdateItem } from '../types';
import { PlusCircle, Trash2, Edit2, Check, MessageSquare, Eye, Calendar, Sparkles, Image, CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';
import ImageUploadPicker from './ImageUploadPicker';

interface TabTimelineProps {
  updates: UpdateItem[];
  isAdmin: boolean;
  onAddUpdate: (item: UpdateItem) => void;
  onUpdateUpdate: (item: UpdateItem) => void;
  onDeleteUpdate: (id: string) => void;
}

export default function TabTimeline({
  updates,
  isAdmin,
  onAddUpdate,
  onUpdateUpdate,
  onDeleteUpdate,
}: TabTimelineProps) {
  // Add Update state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<UpdateItem['category']>('Dia a Dia');
  const [newDate, setNewDate] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageFit, setNewImageFit] = useState<'cover' | 'contain'>('cover');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingUpdateId, setDeletingUpdateId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<UpdateItem['category']>('Dia a Dia');
  const [editDate, setEditDate] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImageFit, setEditImageFit] = useState<'cover' | 'contain'>('cover');

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    onAddUpdate({
      id: `up-${Date.now()}`,
      title: newTitle,
      content: newContent,
      category: newCategory,
      date: newDate || new Date().toISOString().split('T')[0],
      imageUrl: newImageUrl,
      imageFit: newImageFit,
      viewsCount: 1,
    });

    setIsAdding(false);
    setNewTitle('');
    setNewContent('');
    setNewCategory('Dia a Dia');
    setNewDate('');
    setNewImageUrl('');
    setNewImageFit('cover');
  };

  const startEdit = (item: UpdateItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditCategory(item.category);
    setEditDate(item.date);
    setEditImageUrl(item.imageUrl || '');
    setEditImageFit(item.imageFit || 'cover');
  };

  const saveEdit = (id: string) => {
    if (!editTitle || !editContent) return;
    const old = updates.find((u) => u.id === id);
    onUpdateUpdate({
      id,
      title: editTitle,
      content: editContent,
      category: editCategory,
      date: editDate,
      imageUrl: editImageUrl,
      imageFit: editImageFit,
      viewsCount: old ? old.viewsCount : 47,
    });
    setEditingId(null);
  };

  const getCategoryColor = (cat: UpdateItem['category']) => {
    switch (cat) {
      case 'Marco Financeiro':
        return 'bg-natural-light text-natural-primary border-natural-border';
      case 'Tratamento':
        return 'bg-white text-natural-dark border-natural-border';
      case 'Dia a Dia':
        return 'bg-natural-accent/10 text-[#F27D26] border-natural-accent/20';
      case 'Agradecimento':
        return 'bg-natural-primary/10 text-natural-primary border-natural-primary/25';
      case 'Novidades':
        return 'bg-white text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6" id="tab-timeline-container">
      {/* Título de seção e botão adicionar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif italic font-bold text-natural-dark text-sm tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-natural-primary fill-natural-primary" />
            DIÁRIO DE EVOLUÇÃO E ATUALIZAÇÕES FREQUENTES
          </h3>
          <p className="text-xs text-slate-500">Histórias reais de superação, consultas de rotina e o dia a dia do Gabriel.</p>
        </div>

        {isAdmin && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="h-9 px-4 rounded-xl bg-natural-primary hover:bg-natural-primary-dark text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Escrever Atualização
          </button>
        )}
      </div>

      {/* FORMULÁRIO DE NOVA ATUALIZAÇÃO (MODO ADMIN) */}
      {isAdding && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submitAdd}
          className="bg-natural-light border border-natural-border rounded-xl p-5 space-y-4 shadow-inner"
        >
          <div className="flex items-center justify-between border-b border-natural-border pb-2">
            <span className="text-xs font-bold text-natural-dark tracking-wider flex items-center gap-1">
              <PlusCircle className="w-4 h-4 text-[#F27D26]" /> REGISTRAR NOVA NOTÍCIA NO DIÁRIO DO GABRIEL
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Título da Notícia / Marco</label>
              <input
                type="text"
                required
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                placeholder="Ex: Gabriel participou do drum circle neste final de semana!"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Data da Notícia</label>
              <input
                type="date"
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Categoria de Entrada</label>
              <select
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as UpdateItem['category'])}
              >
                <option value="Dia a Dia">Dia a Dia (Histórias de Ritmo/Família)</option>
                <option value="Tratamento">Tratamento (Terapia Ocupacional, TO, Fono)</option>
                <option value="Marco Financeiro">Marco Financeiro (Contas/Transparência)</option>
                <option value="Agradecimento">Agradecimento</option>
                <option value="Novidades">Novidades</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <ImageUploadPicker
                label="Foto de Capa / Imagem da Notícia"
                value={newImageUrl}
                onChange={setNewImageUrl}
              />
            </div>
            {newImageUrl && (
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Ajuste Inteligente da Imagem</label>
                <select
                  className="w-full h-10 px-3 bg-white border border-natural-border rounded-xl text-xs outline-none focus:border-natural-primary"
                  value={newImageFit}
                  onChange={(e) => setNewImageFit(e.target.value as 'cover' | 'contain')}
                >
                  <option value="cover">Preencher (Recortar para encaixar no banner)</option>
                  <option value="contain">Conter (Mostrar foto inteira com preenchimento desfocado inteligente)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Relato Emocional Detalhado (Corpo do Diário)</label>
            <textarea
              required
              rows={4}
              className="w-full p-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary leading-relaxed"
              placeholder="Descreva o que aconteceu de especial nesse dia, evolution das terapias, etc..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="h-10 px-6 rounded-lg bg-natural-accent hover:bg-natural-accent-hover text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Publicar no Diário
          </button>
        </motion.form>
      )}

      {/* FEED DE TIMELINE */}
      <div className="relative border-l border-natural-border ml-4 pl-6 sm:pl-8 space-y-8" id="timeline-feed-root">
        {updates.map((item) => {
          const isEditingThis = editingId === item.id;

          return (
            <div key={item.id} className="relative" id={`timeline-card-${item.id}`}>
              {/* Círculo do marco na linha vertical */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-natural-primary z-10 shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26]" />
              </div>

              {isEditingThis ? (
                /* FORMULARIO EDITAR LINHA */
                <div className="bg-natural-light border border-natural-border rounded-2xl p-5 space-y-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Título de Entrada</label>
                      <input
                        type="text"
                        className="w-full h-8 px-2 bg-white rounded border border-natural-border text-xs focus:border-natural-primary outline-none"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Data</label>
                      <input
                        type="date"
                        className="w-full h-8 px-2 bg-white rounded border border-natural-border text-xs focus:border-natural-primary outline-none"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Categoria</label>
                      <select
                        className="w-full h-8 px-1.5 bg-white rounded border border-natural-border text-xs focus:border-natural-primary outline-none"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as UpdateItem['category'])}
                      >
                        <option value="Dia a Dia">Dia a Dia</option>
                        <option value="Tratamento">Tratamento</option>
                        <option value="Marco Financeiro">Marco Financeiro</option>
                        <option value="Agradecimento">Agradecimento</option>
                        <option value="Novidades">Novidades</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 mt-2">
                      <ImageUploadPicker
                        label="Imagem do Diário / Banner (Drag-Drop ou Paste)"
                        value={editImageUrl}
                        onChange={setEditImageUrl}
                      />
                    </div>
                    {editImageUrl && (
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Ajuste Inteligente da Imagem</label>
                        <select
                          className="w-full h-8 px-2 bg-white rounded border border-natural-border text-xs focus:border-natural-primary outline-none animate-fadeIn"
                          value={editImageFit}
                          onChange={(e) => setEditImageFit(e.target.value as 'cover' | 'contain')}
                        >
                          <option value="cover">Preencher (Recortar para encaixar no banner)</option>
                          <option value="contain">Conter (Mostrar foto inteira com preenchimento desfocado inteligente)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                     <label className="block text-[10px] font-semibold text-slate-500 mb-1">Narrativa</label>
                    <textarea
                      rows={3}
                      className="w-full p-2.5 bg-white rounded border border-natural-border text-xs focus:border-natural-primary outline-none"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(item.id)}
                      className="px-3 h-8 text-xs font-semibold text-white bg-natural-accent hover:bg-natural-accent-hover rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar Alterações
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 h-8 text-xs font-semibold text-natural-dark bg-natural-border/40 hover:bg-natural-border rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                /* EXIBIÇÃO TRADICIONAL */
                <div className="bg-white rounded-2xl border border-natural-border shadow-xs hover:shadow-xs transition-shadow overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    
                    {/* Imagem do lado esquerdo (Opcional se houver) */}
                    {item.imageUrl && (
                      <div className="relative h-48 md:h-full min-h-[160px] overflow-hidden bg-slate-900/5 flex items-center justify-center">
                        {item.imageFit === 'contain' ? (
                          <>
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 select-none scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="relative z-10 max-w-full max-h-full object-contain p-1"
                              referrerPolicy="no-referrer"
                            />
                          </>
                        ) : (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute top-3 left-3 z-20">
                          <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-full uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className={`p-5 space-y-3 ${item.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-natural-border pb-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                          <span className="text-slate-200">|</span>
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-3 h-3 text-slate-300" /> {item.viewsCount} visualizações
                          </span>
                        </div>

                        {/* Ações de Edição se Admin */}
                        {isAdmin && (
                          <div className="flex items-center gap-1.5" id={`update-admin-pane-${item.id}`}>
                            {deletingUpdateId !== item.id ? (
                              <>
                                <button
                                  onClick={() => startEdit(item)}
                                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-natural-light text-natural-primary hover:bg-natural-border flex items-center gap-0.5 transition-colors cursor-pointer border border-natural-border/40"
                                >
                                  <Edit2 className="w-2.5 h-2.5" /> Editar
                                </button>
                                <button
                                  onClick={() => setDeletingUpdateId(item.id)}
                                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center gap-0.5 transition-colors cursor-pointer border border-rose-100"
                                >
                                  Excluir
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-50 border border-rose-200 rounded-md shadow-xs">
                                <span className="text-[9px] font-extrabold text-rose-700">Excluir?</span>
                                <button
                                  onClick={() => {
                                    onDeleteUpdate(item.id);
                                    setDeletingUpdateId(null);
                                  }}
                                  className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] rounded cursor-pointer"
                                >
                                  Sim
                                </button>
                                <button
                                  onClick={() => setDeletingUpdateId(null)}
                                  className="px-1.5 py-0.5 bg-slate-500 hover:bg-slate-600 text-white font-extrabold text-[9px] rounded cursor-pointer"
                                >
                                  Não
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {!item.imageUrl && (
                          <span className={`inline-flex px-2 py-0.5 border text-[9px] font-bold rounded-full uppercase tracking-wider mb-1 ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        )}
                        <h4 className="font-serif italic font-bold text-natural-dark text-[15px] sm:text-[16px] leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed whitespace-pre-line">
                          {item.content}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}

        {updates.length === 0 && (
          <div className="py-8 text-center text-slate-400 text-xs">
            Nenhuma notícia publicada ainda. Ative o modo editor com o PIN para escrever sua primeira publicação!
          </div>
        )}
      </div>
    </div>
  );
}
