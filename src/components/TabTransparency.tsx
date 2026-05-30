import React, { useState } from 'react';
import { TransparencyItem, Campaign } from '../types';
import { obterDadosDaCampanha } from '../campanhaConfig';
import { 
  PlusCircle, Trash2, Edit2, Check, ExternalLink, Calendar, 
  CreditCard, DollarSign, RefreshCw, Layers, CheckCircle2, 
  AlertCircle, Plus, X, Save, Shield, Activity, Award 
} from 'lucide-react';
import { motion } from 'motion/react';

interface TabTransparencyProps {
  transparencyItems: TransparencyItem[];
  campaign: Campaign;
  isAdmin: boolean;
  onAddExpense: (item: TransparencyItem) => void;
  onUpdateExpense: (item: TransparencyItem) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateCampaign?: (updated: Campaign) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Saúde':
      return <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    case 'Terapias':
      return <Activity className="w-3.5 h-3.5 text-natural-primary shrink-0" />;
    case 'Medicamentos':
      return <PlusCircle className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
    case 'Educação':
      return <Award className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    case 'Adaptação':
      return <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
    case 'Acessibilidade':
      return <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />;
    default:
      return <CreditCard className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
  }
};

export default function TabTransparency({
  transparencyItems,
  campaign,
  isAdmin,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onUpdateCampaign,
}: TabTransparencyProps) {
  // Add Expense form state
  const [isAdding, setIsAdding] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<TransparencyItem['category']>('Terapias');
  const [newAmount, setNewAmount] = useState('');
  const [newStatus, setNewStatus] = useState<TransparencyItem['status']>('pago');
  const [newDate, setNewDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Row/card editing states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState<TransparencyItem['category']>('Terapias');
  const [editAmount, setEditAmount] = useState('');
  const [editStatus, setEditStatus] = useState<TransparencyItem['status']>('pago');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Painel de Edição dos 3 Cards Principais
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [editTargetAmount, setEditTargetAmount] = useState(campaign.targetAmount);
  const [editRaisedAmount, setEditRaisedAmount] = useState(campaign.raisedAmount);
  const [editDonorCount, setEditDonorCount] = useState(campaign.donorCount);
  const [editUseOverrideSpent, setEditUseOverrideSpent] = useState(campaign.useOverrideTotalSpent || false);
  const [editOverrideSpent, setEditOverrideSpent] = useState(campaign.overrideTotalSpent || 0);
  const [editUseOverrideForecast, setEditUseOverrideForecast] = useState(campaign.useOverrideTotalForecast || false);
  const [editOverrideForecast, setEditOverrideForecast] = useState(campaign.overrideTotalForecast || 0);

  const dadosDaCampanha = obterDadosDaCampanha(campaign, transparencyItems);
  const percentRaised = dadosDaCampanha.progressoPorcentagemAjustada;

  const startEditRow = (item: TransparencyItem) => {
    setEditingId(item.id);
    setEditDesc(item.description);
    setEditCategory(item.category);
    setEditAmount(item.amount.toString());
    setEditStatus(item.status);
    setEditDate(item.date);
    setEditNotes(item.notes || '');
  };

  const handleSaveRow = (id: string) => {
    if (!editDesc || !editAmount) {
      alert('Preencha a descrição e o valor da despesa/investimento.');
      return;
    }
    onUpdateExpense({
      id,
      description: editDesc,
      category: editCategory,
      amount: parseFloat(editAmount) || 0,
      status: editStatus,
      date: editDate || new Date().toISOString().split('T')[0],
      notes: editNotes,
    });
    setEditingId(null);
  };

  const handleStartEditingStats = () => {
    setEditTargetAmount(campaign.targetAmount);
    setEditRaisedAmount(campaign.raisedAmount);
    setEditDonorCount(campaign.donorCount);
    setEditUseOverrideSpent(campaign.useOverrideTotalSpent || false);
    setEditOverrideSpent(campaign.overrideTotalSpent || 0);
    setEditUseOverrideForecast(campaign.useOverrideTotalForecast || false);
    setEditOverrideForecast(campaign.overrideTotalForecast || 0);
    setIsEditingStats(true);
  };

  const handleSaveStats = () => {
    if (onUpdateCampaign) {
      onUpdateCampaign({
        ...campaign,
        targetAmount: Number(editTargetAmount),
        raisedAmount: Number(editRaisedAmount),
        donorCount: Number(editDonorCount),
        useOverrideTotalSpent: editUseOverrideSpent,
        overrideTotalSpent: Number(editOverrideSpent),
        useOverrideTotalForecast: editUseOverrideForecast,
        overrideTotalForecast: Number(editOverrideForecast),
      });
    }
    setIsEditingStats(false);
  };

  const getStatusBadge = (status: TransparencyItem['status']) => {
    switch (status) {
      case 'pago':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">● Realizado / Pago</span>;
      case 'previsto':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">☼ Projetado / Previsto</span>;
      case 'agendado':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">⇄ Agendado</span>;
    }
  };

  return (
    <div className="space-y-6" id="transparency-tab-content">
      {/* BOTÃO EXCLUSIVO DE REGULAÇÃO DOS CARDS FINANCEIROS (VISÍVEL APENAS PARA ADMINISTRADOR) */}
      {isAdmin && (
        <div className="flex justify-end" id="admin-meta-adjustment-row">
          <button
            type="button"
            onClick={isEditingStats ? () => setIsEditingStats(false) : handleStartEditingStats}
            className="h-8 px-4 bg-[#F27D26] hover:bg-[#d66518] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditingStats ? 'Ver Resultados' : 'Painel de Ajuste dos 3 Cards'}
          </button>
        </div>
      )}

      {/* PAINEL DE CONFIGURAÇÃO DIRETA DOS CARDS FINANCEIROS E METAS */}
      {isAdmin && isEditingStats && (
        <div className="bg-natural-light border border-natural-border p-5 rounded-2xl space-y-4 animate-fadeIn" id="panel-edit-financial-cards">
          <div className="flex items-center justify-between border-b border-natural-border pb-2">
            <h4 className="font-serif italic font-bold text-natural-dark text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-natural-primary" />
              Painel de Ajuste: Configuração Direta dos Cards
            </h4>
            <span className="text-[10px] text-[#F27D26] font-mono font-bold uppercase">Modo Administrador</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Resumo Financeiro e Metas */}
            <div className="bg-white p-4 rounded-xl border border-natural-border space-y-3 shadow-2xs">
              <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#F27D26]">1. Resumo Financeiro e Metas</p>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Meta Global (R$)</label>
                  <input
                    type="number"
                    className="w-full h-8 px-2.5 bg-slate-50 border border-natural-border rounded-lg text-xs font-semibold outline-none focus:border-natural-primary"
                    value={editTargetAmount}
                    onChange={(e) => setEditTargetAmount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Valor Arrecadado (R$)</label>
                  <input
                    type="number"
                    className="w-full h-8 px-2.5 bg-slate-50 border border-natural-border rounded-lg text-xs font-semibold outline-none focus:border-natural-primary"
                    value={editRaisedAmount}
                    onChange={(e) => setEditRaisedAmount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Apoiadores</label>
                  <input
                    type="number"
                    className="w-full h-8 px-2.5 bg-slate-50 border border-natural-border rounded-lg text-xs font-semibold outline-none focus:border-natural-primary"
                    value={editDonorCount}
                    onChange={(e) => setEditDonorCount(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Investido em Terapias */}
            <div className="bg-white p-4 rounded-xl border border-natural-border space-y-3 shadow-2xs">
              <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-600">2. Investido em Terapias (Pago)</p>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer pt-1 bg-slate-50 border border-natural-border/60 p-2 rounded-lg text-xs font-semibold text-slate-650 select-none">
                  <input
                    type="checkbox"
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    checked={editUseOverrideSpent}
                    onChange={(e) => setEditUseOverrideSpent(e.target.checked)}
                  />
                  Sobrescrever cálculo automático
                </label>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Valor Pago Fixo (R$)</label>
                  <input
                    type="number"
                    disabled={!editUseOverrideSpent}
                    className="w-full h-8 px-2.5 bg-slate-50 disabled:bg-slate-100 disabled:opacity-60 border border-natural-border rounded-lg text-xs font-semibold outline-none focus:border-natural-primary"
                    value={editOverrideSpent}
                    onChange={(e) => setEditOverrideSpent(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-slate-400 mt-1 leading-normal italic">
                    {editUseOverrideSpent 
                      ? "Exibindo valor fixo digitado acima." 
                      : "Valor calculado automaticamente a partir das despesas 'Pagas'."}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Custos Futuros Planejados */}
            <div className="bg-white p-4 rounded-xl border border-natural-border space-y-3 shadow-2xs">
              <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-600">3. Custos Futuros Planejados</p>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer pt-1 bg-slate-50 border border-natural-border/60 p-2 rounded-lg text-xs font-semibold text-slate-650 select-none">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    checked={editUseOverrideForecast}
                    onChange={(e) => setEditUseOverrideForecast(e.target.checked)}
                  />
                  Sobrescrever cálculo automático
                </label>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Valor Planejado Fixo (R$)</label>
                  <input
                    type="number"
                    disabled={!editUseOverrideForecast}
                    className="w-full h-8 px-2.5 bg-slate-50 disabled:bg-slate-100 disabled:opacity-60 border border-natural-border rounded-lg text-xs font-semibold outline-none focus:border-natural-primary"
                    value={editOverrideForecast}
                    onChange={(e) => setEditOverrideForecast(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-slate-400 mt-1 leading-normal italic">
                    {editUseOverrideForecast 
                      ? "Exibindo valor fixo digitado acima." 
                      : "Valor calculado de despesas previstas ou agendadas."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-natural-border pt-3">
            <button
              type="button"
              onClick={() => setIsEditingStats(false)}
              className="h-8 px-4 border border-natural-border rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveStats}
              className="h-8 px-4 bg-natural-primary hover:bg-natural-primary-dark rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Salvar Configurações
            </button>
          </div>
        </div>
      )}

      {/* Bloco de Progresso / Metas */}
      <div className="bg-natural-dark text-white rounded-2xl p-6 shadow-md grid grid-cols-1 md:grid-cols-4 gap-6 relative overflow-hidden">
        <div className="md:col-span-2 space-y-3 relative z-10">
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#F27D26] font-bold">Resumo Financeiro e Metas</p>
          <div className="space-y-1">
            <span className="text-3xl font-serif font-bold italic tracking-tight">
              R$ {dadosDaCampanha.valorArrecadadoFormatado}
            </span>
            <span className="text-slate-355 block text-xs">
              arrecadados de uma meta global de R$ {dadosDaCampanha.metaGlobalFormatada}
            </span>
          </div>

          {/* Progresso UI */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-[#F27D26]">{percentRaised.toFixed(1)}% Alcançados</span>
              <span className="text-slate-350">R$ {dadosDaCampanha.valorRestanteFormatado} restantes</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentRaised}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-natural-primary rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl space-y-1 border border-white/10 relative z-10 flex flex-col justify-center">
          <span className="text-[10px] text-slate-300 uppercase font-bold">Investido em Terapias (Pago)</span>
          <p className="text-lg font-serif italic font-bold text-white">
            R$ {dadosDaCampanha.totalInvestidoTerapiasFormatado}
          </p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-medium leading-none">
            <CheckCircle2 className="w-3 h-3 text-none fill-emerald-400 text-natural-dark" /> Transparência Máxima
          </span>
        </div>

        <div className="bg-white/5 p-4 rounded-xl space-y-1 border border-white/10 relative z-10 flex flex-col justify-center">
          <span className="text-[10px] text-slate-300 uppercase font-bold">Custos Futuros Planejados</span>
          <p className="text-lg font-serif italic font-bold text-[#F27D26]">
            R$ {dadosDaCampanha.totalCustosPlanejadosFormatado}
          </p>
          <span className="text-[10px] text-yellow-400 flex items-center gap-0.5 font-medium leading-none">
            <AlertCircle className="w-3 h-3 text-none" /> Projeção de despesas
          </span>
        </div>
      </div>

      {/* Título de seção e botão de inserir despesa (Modo Admin) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif italic font-bold text-natural-dark text-sm tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-natural-primary" />
            UTILIZAÇÃO DETALHADA DOS RECURSOS (PRESTAÇÃO DE CONTAS)
          </h3>
          <p className="text-xs text-slate-500">Acompanhe individualmente cada destinação, terapias realizadas ou medicamentos comprovados.</p>
        </div>

        {isAdmin && !isAdding && (
          <button
            onClick={() => {
              // Preparar estados limpos ao abrir o card de inserção
              setNewDesc('');
              setNewCategory('Terapias');
              setNewAmount('');
              setNewStatus('pago');
              setNewDate(new Date().toISOString().split('T')[0]);
              setNewNotes('');
              setIsAdding(true);
            }}
            className="h-9 px-4 rounded-xl bg-natural-primary hover:bg-natural-primary-dark font-semibold text-xs text-white flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs focus:outline-none"
          >
            <PlusCircle className="w-4 h-4" /> Inserir Novo Card
          </button>
        )}
      </div>

      {/* GRADE DE CARDS INTERATIVOS (TRANSFORMAÇÃO DA TABELA EM ESTRUTURA MODULAR DE CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="transparency-cards-container">
        
        {/* CARD DINÂMICO PARA INCLUIR NOVO LANÇAMENTO (SEMPRE VISÍVEL COMO GATILHO OU ATIVO PARA DIGITAÇÃO) */}
        {isAdmin && (
          !isAdding ? (
            <button
              onClick={() => {
                setNewDesc('');
                setNewCategory('Terapias');
                setNewAmount('');
                setNewStatus('pago');
                setNewDate(new Date().toISOString().split('T')[0]);
                setNewNotes('');
                setIsAdding(true);
              }}
              className="border-2 border-dashed border-natural-border hover:border-natural-primary hover:bg-natural-light/20 transition-all rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[350px] space-y-3 group focus:outline-none bg-white"
              id="add-card-trigger-inside-grid"
            >
              <div className="p-4 rounded-full bg-natural-light group-hover:bg-natural-primary/10 transition-colors">
                <Plus className="w-8 h-8 text-natural-primary" />
              </div>
              <div className="space-y-1">
                <span className="block font-serif italic font-bold text-natural-dark text-base">Incluir Novo Lançamento</span>
                <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">Clique para preencher os valores e lançar uma nova conta de transparência.</p>
              </div>
            </button>
          ) : (
            /* CARD DE PREENCHIMENTO DE VALORES PARA INCLUIR */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-natural-light/40 border-2 border-natural-primary rounded-3xl p-5 flex flex-col justify-between min-h-[350px] shadow-sm space-y-3"
              id="new-expense-input-card"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-natural-border pb-1.5">
                  <span className="text-[10px] font-bold text-natural-primary uppercase tracking-widest font-mono">Digitar Novo Lançamento</span>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="p-1 text-[10px] text-slate-400 hover:text-rose-500 font-bold tracking-tight"
                    title="Cancelar"
                  >
                    Descartar
                  </button>
                </div>

                <div className="space-y-2 text-left">
                  <div>
                    <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Descrição do Serviço / Compra</label>
                    <input
                      type="text"
                      required
                      className="w-full h-8 px-2.5 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary font-semibold text-slate-800"
                      placeholder="Ex: Pilates Funcional Terapêutico"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full h-8 px-2.5 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary font-mono font-bold text-slate-800"
                        placeholder="Ex: 140.00"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Status</label>
                      <select
                        className="w-full h-8 px-1.5 bg-white border border-natural-border rounded-lg text-[11px] font-semibold outline-none focus:border-natural-primary text-slate-700"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as TransparencyItem['status'])}
                      >
                        <option value="pago">Pago</option>
                        <option value="previsto">Previsto</option>
                        <option value="agendado">Agendado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Categoria</label>
                      <select
                        className="w-full h-8 px-1.5 bg-white border border-natural-border rounded-lg text-[11px] font-semibold outline-none focus:border-natural-primary text-slate-700"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as TransparencyItem['category'])}
                      >
                        <option value="Terapias">Terapias</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Medicamentos">Medicamentos</option>
                        <option value="Educação">Educação</option>
                        <option value="Adaptação">Adaptação</option>
                        <option value="Acessibilidade">Acessibilidade</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Data</label>
                      <input
                        type="date"
                        className="w-full h-8 px-2 bg-white border border-natural-border rounded-lg text-[11px] font-mono outline-none focus:border-natural-primary"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Notas Adicionais / Dica</label>
                    <input
                      type="text"
                      className="w-full h-8 px-2.5 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary text-slate-650"
                      placeholder="Ex: Cupom fiscal fpg-312"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-1 border-t border-natural-border/60">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 h-8 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold focus:outline-none transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newDesc || !newAmount) {
                      alert('Digite pelo menos a descrição e o valor do gasto.');
                      return;
                    }
                    onAddExpense({
                      id: `exp-${Date.now()}`,
                      description: newDesc,
                      category: newCategory,
                      amount: parseFloat(newAmount) || 0,
                      status: newStatus,
                      date: newDate || new Date().toISOString().split('T')[0],
                      notes: newNotes,
                    });
                    setIsAdding(false);
                  }}
                  className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 focus:outline-none transition-all cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Salvar Card
                </button>
              </div>
            </motion.div>
          )
        )}

        {/* LISTAGEM DOS CARDS FINANCEIROS DE TRANSPARÊNCIA */}
        {transparencyItems.map((item) => {
          const isEditingTarget = editingId === item.id;

          if (isEditingTarget) {
            return (
              /* CARD DE EDIÇÃO ATIVA DE DETALHES */
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-natural-light/20 border-2 border-natural-accent rounded-3xl p-5 flex flex-col justify-between min-h-[350px] shadow-sm space-y-3"
                id={`edit-panel-card-${item.id}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-natural-border pb-1.5">
                    <span className="text-[10px] font-bold text-natural-accent uppercase tracking-widest font-mono">Digitar Dados do Card</span>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-650 font-bold"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="space-y-2 text-left">
                    <div>
                      <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Descrição do Serviço / Compra</label>
                      <input
                        type="text"
                        required
                        className="w-full h-8 px-2.5 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary font-semibold text-slate-800"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Valor (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          className="w-full h-8 px-2.5 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary font-mono font-bold text-slate-800"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Status</label>
                        <select
                          className="w-full h-8 px-1.5 bg-white border border-natural-border rounded-lg text-[11px] font-semibold outline-none focus:border-natural-primary text-slate-705"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as TransparencyItem['status'])}
                        >
                          <option value="pago">Pago / Realizado</option>
                          <option value="previsto">Previsto</option>
                          <option value="agendado">Agendado</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Categoria</label>
                        <select
                          className="w-full h-8 px-1.5 bg-white border border-natural-border rounded-lg text-[11px] font-semibold outline-none focus:border-natural-primary text-slate-705"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as TransparencyItem['category'])}
                        >
                          <option value="Terapias">Terapias</option>
                          <option value="Saúde">Saúde</option>
                          <option value="Medicamentos">Medicamentos</option>
                          <option value="Educação">Educação</option>
                          <option value="Adaptação">Adaptação</option>
                          <option value="Acessibilidade">Acessibilidade</option>
                          <option value="Outros">Outros</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Data</label>
                        <input
                          type="date"
                          className="w-full h-8 px-2 bg-white border border-natural-border rounded-lg text-[11px] font-mono outline-none focus:border-natural-primary"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-[#444430] uppercase mb-0.5">Notas do Card / Documentos</label>
                      <input
                        type="text"
                        className="w-full h-8 px-2.5 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary text-slate-650"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 border-t border-natural-border/60">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="flex-1 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold focus:outline-none transition-all cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveRow(item.id)}
                    className="flex-1 h-8 bg-natural-accent hover:bg-natural-accent-hover text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 focus:outline-none transition-all cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Salvar Card
                  </button>
                </div>
              </motion.div>
            );
          }

          return (
            /* CARD VISUAL PRINCIPAL EXIBÍVEL COM CAMPOS DILIGENTES */
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              className="bg-white border border-natural-border rounded-3xl p-5 flex flex-col justify-between min-h-[350px] shadow-2xs hover:shadow-xs transition-all relative text-left"
              id={`transparency-item-card-${item.id}`}
            >
              <div className="space-y-4">
                {/* Header do Card (Categoria + Status) */}
                <div className="flex justify-between items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 rounded-full px-2.5 py-1">
                    {getCategoryIcon(item.category)}
                    {item.category}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                {/* Body do Card (Descrição e Nota) */}
                <div className="space-y-2">
                  <h4 className="font-serif italic font-semibold text-natural-dark text-lg leading-snug block">
                    {item.description}
                  </h4>
                  
                  {item.notes ? (
                    <p className="text-[11px] text-slate-550 leading-relaxed font-sans bg-natural-light/50 p-2.5 rounded-xl border border-natural-border/40">
                      <span className="font-semibold block text-[9.5px] uppercase tracking-wider text-slate-400 font-mono mb-0.5">Observação:</span>
                      {item.notes}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-450 font-sans italic">Sem observações descritas para este card de despesa.</p>
                  )}
                </div>
              </div>

              {/* Footer do Card (Data, Valor & Ações Admin) */}
              <div className="border-t border-natural-border/50 pt-3.5 space-y-3.5 mt-auto">
                <div className="flex justify-between items-end gap-1.5">
                  <div className="space-y-0.5">
                    <span className="block text-[9px] text-slate-400 uppercase font-mono font-bold tracking-wider leading-none">Data Competência</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-semibold font-mono">
                      <Calendar className="w-3.5 h-3.5 text-natural-primary shrink-0" />
                      {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <span className="block text-[9px] text-[#F27D26] uppercase font-mono font-bold tracking-wider leading-none mb-0.5">Valor Unitário</span>
                    <span className="text-xl font-serif font-bold italic text-natural-dark">
                      R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* BOTÕES DE EDITAR / EXCLUIR / SALVAR NO CARD (MODO ADMIN) */}
                {isAdmin && (
                  <div className="flex justify-end gap-1.5 border-t border-dashed border-natural-border/65 pt-2" id={`admin-card-actions-${item.id}`}>
                    {deletingExpenseId !== item.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => startEditRow(item)}
                          className="h-7 px-3 bg-natural-light border border-natural-border hover:bg-natural-border/30 rounded-lg text-[10px] font-bold text-natural-primary flex items-center gap-1 transition-all cursor-pointer focus:outline-none"
                          title="Editar e digitar novos valores no card"
                        >
                          <Edit2 className="w-3 h-3" /> Editar Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingExpenseId(item.id)}
                          className="h-7 px-3 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer focus:outline-none"
                          title="Excluir card"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                        <span className="text-[10px] font-extrabold text-rose-700 uppercase px-1">Excluir?</span>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteExpense(item.id);
                            setDeletingExpenseId(null);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] rounded-md cursor-pointer"
                        >
                          Sim
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingExpenseId(null)}
                          className="px-2.5 py-1 bg-slate-500 hover:bg-slate-600 text-white font-extrabold text-[9px] rounded-md cursor-pointer"
                        >
                          Não
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {transparencyItems.length === 0 && (
          <div className="col-span-full border border-dashed border-natural-border rounded-2xl py-12 text-center text-slate-400 text-xs bg-white">
            Nenhuma despesa ou prestação de contas cadastrada ou correspondente.
          </div>
        )}
      </div>

      {/* Nota de rodapé da auditoria */}
      <div className="p-3 bg-natural-light border border-natural-border rounded-xl text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
        <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0" />
        Auditoria Social Continuada: A receita de apoios é deduzida de forma transparente para pagar os tratamentos nestes cards catalogados.
      </div>
    </div>
  );
}
