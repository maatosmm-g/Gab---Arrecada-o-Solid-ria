import React, { useState } from 'react';
import { MedicalReport } from '../types';
import { FileText, PlusCircle, Trash2, Edit2, Check, Download, AlertCircle, FilePlus, Eye, ShieldCheck, User, Calendar, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TabReportsProps {
  reports: MedicalReport[];
  isAdmin: boolean;
  onAddReport: (report: MedicalReport) => void;
  onUpdateReport: (report: MedicalReport) => void;
  onDeleteReport: (id: string) => void;
}

export default function TabReports({
  reports,
  isAdmin,
  onAddReport,
  onUpdateReport,
  onDeleteReport,
}: TabReportsProps) {
  // Add dialogs / state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newCRM, setNewCRM] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [fakeFileName, setFakeFileName] = useState('');
  const [fakeFileSize, setFakeFileSize] = useState('');

  // Editing raw states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDoctor, setEditDoctor] = useState('');
  const [editCRM, setEditCRM] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDiagnosis, setEditDiagnosis] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Selected report to preview in medical window
  const [previewReport, setPreviewReport] = useState<MedicalReport | null>(null);

  const handleFakeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFakeFileName(file.name);
      setFakeFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDoctor) return;

    onAddReport({
      id: `rep-${Date.now()}`,
      title: newTitle,
      doctorName: newDoctor,
      doctorCRM: newCRM || 'CRM/RS não declarado',
      specialty: newSpecialty || 'Especialista',
      date: newDate || new Date().toISOString().split('T')[0],
      diagnosis: newDiagnosis || 'Avaliação Desenvolvimento',
      notes: newNotes || 'Sem observações adicionais.',
      fileName: fakeFileName || 'laudo_diagnostico_estimulado_2026.pdf',
      fileSize: fakeFileSize || '1.1 MB',
    });

    // Reset Form
    setIsAdding(false);
    setNewTitle('');
    setNewDoctor('');
    setNewCRM('');
    setNewSpecialty('');
    setNewDate('');
    setNewDiagnosis('');
    setNewNotes('');
    setFakeFileName('');
    setFakeFileSize('');
  };

  const startEdit = (rep: MedicalReport) => {
    setEditingId(rep.id);
    setEditTitle(rep.title);
    setEditDoctor(rep.doctorName);
    setEditCRM(rep.doctorCRM);
    setEditSpecialty(rep.specialty);
    setEditDate(rep.date);
    setEditDiagnosis(rep.diagnosis || '');
    setEditNotes(rep.notes);
  };

  const saveEdit = (id: string) => {
    if (!editTitle || !editDoctor) return;
    const old = reports.find((r) => r.id === id);
    onUpdateReport({
      id,
      title: editTitle,
      doctorName: editDoctor,
      doctorCRM: editCRM,
      specialty: editSpecialty,
      date: editDate,
      diagnosis: editDiagnosis,
      notes: editNotes,
      fileName: old ? old.fileName : 'laudo_morfologico.pdf',
      fileSize: old ? old.fileSize : '950 KB',
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6" id="medical-reports-view">
      {/* Informações de Credibilidade e Segurança (Pilar 1 - Confiança) */}
      <div className="bg-natural-light border border-natural-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-serif italic font-bold text-natural-dark text-[15px] sm:text-base flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-natural-primary" />
            REPOSITÓRIO ADAPTADO DE LAUDOS E RELATÓRIOS MÉDICOS
          </h4>
          <p className="text-xs text-slate-650 leading-relaxed font-sans max-w-2xl">
            Para garantir transparência absoluta quanto à condição e progresso clínico de Gabriel Moraes Matos, publicamos os laudos originais fornecidos pelos fonoaudiólogos, neuropediatras e psicólogos autorizados.
          </p>
        </div>

        {isAdmin && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="h-9 px-4 rounded-xl bg-natural-primary hover:bg-natural-primary-dark text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Anexar Relatório Clínico
          </button>
        )}
      </div>

      {/* FORMULÁRIO PARA ANEXAR NOVO RELATÓRIO (MODO ADMIN) */}
      {isAdding && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submitAdd}
          className="bg-natural-light border border-natural-border rounded-xl p-5 space-y-4 shadow-inner"
        >
          <div className="flex items-center justify-between border-b border-natural-border pb-2">
            <span className="text-xs font-bold text-natural-dark tracking-wider flex items-center gap-1">
              <FilePlus className="w-4 h-4 text-natural-primary" /> REGISTRAR LAUDO OU TESTE MÉDICO NO HISTÓRICO
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
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Título do Laudo / Relatório</label>
              <input
                type="text"
                required
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                placeholder="Ex: Relatório de Evolução Psicomotora das Terapias"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Data de Emissão do Laudo</label>
              <input
                type="date"
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Nome do Médico / Profissional</label>
              <input
                type="text"
                required
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                placeholder="Ex: Dra. Ana Julia Silveira"
                value={newDoctor}
                onChange={(e) => setNewDoctor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">CRM / registro profissional</label>
              <input
                type="text"
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                placeholder="Ex: CRM/RS 51422"
                value={newCRM}
                onChange={(e) => setNewCRM(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Especialidade / Clinica</label>
              <input
                type="text"
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                placeholder="Ex: Terapeuta Ocupacional Pediátrica"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Hipótese Diagnóstica / CID principal</label>
              <input
                type="text"
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                placeholder="Ex: CID 10 F84.0 ou Atraso Motor"
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
              />
            </div>
            {/* FILE UPLOAD INTERFACE (MANDATORY INSTRUCTION: drag-drop and click upload) */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Upload de Arquivo (PDF ou Imagem do Laudo)</label>
              <div className="relative border-2 border-dashed border-natural-border rounded-lg bg-white h-20 hover:bg-natural-light flex items-center justify-center p-3 cursor-pointer transition-colors">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="absolute inset-0 opacity-0 w-full cursor-pointer"
                  onChange={handleFakeFileSelect}
                />
                <div className="text-center text-slate-500 text-[11px] font-sans">
                  {fakeFileName ? (
                    <p className="text-natural-primary font-semibold">{fakeFileName} ({fakeFileSize})</p>
                  ) : (
                    <p>Arraste PDF aqui ou <strong className="text-natural-accent underline">clique para selecionar laudo</strong></p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Notas Clínicas e Evolução Recomendada</label>
            <textarea
              rows={3}
              className="w-full p-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
              placeholder="Descreva as orientações de dosagem, necessidade de fono ou fisioterapia..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="h-10 px-6 rounded-lg bg-natural-accent hover:bg-natural-accent-hover text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Anexar Documento de Saúde
          </button>
        </motion.form>
      )}

      {/* LISTA GERAL DE LAUDOS E ARQUIVOS CLÍNICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="reports-grid-root">
        {reports.map((rep) => {
          const isEditingThis = editingId === rep.id;

          return (
            <div key={rep.id} className="relative">
              {isEditingThis ? (
                /* ALTERAÇÃO DIRETA (EDITÁVEL) */
                <div className="bg-natural-light border border-natural-border rounded-2xl p-4 space-y-3">
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full h-8 px-2 bg-white rounded border border-natural-border text-xs font-semibold"
                      placeholder="Título laudo"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full h-8 px-2 bg-white rounded border border-natural-border text-xs"
                      placeholder="Médico"
                      value={editDoctor}
                      onChange={(e) => setEditDoctor(e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full h-8 px-2 bg-white rounded border border-natural-border text-xs"
                      placeholder="CRM"
                      value={editCRM}
                      onChange={(e) => setEditCRM(e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full h-8 px-2 bg-white rounded border border-natural-border text-xs"
                      placeholder="Especialidade"
                      value={editSpecialty}
                      onChange={(e) => setEditSpecialty(e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full h-8 px-2 bg-white rounded border border-natural-border text-xs"
                      placeholder="CID / Diagnóstico"
                      value={editDiagnosis}
                      onChange={(e) => setEditDiagnosis(e.target.value)}
                    />
                    <textarea
                      rows={2}
                      className="w-full p-2 bg-white rounded border border-natural-border text-xs"
                      placeholder="Observações clínicas"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => saveEdit(rep.id)}
                      className="w-1/2 h-8 text-[11px] font-semibold text-white bg-natural-accent hover:bg-natural-accent-hover rounded transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="w-1/2 h-8 text-[11px] font-semibold text-natural-dark bg-natural-border/30 rounded transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                /* EXIBIÇÃO DE CARD MÉDICO DESIGN SOLIDÁRIO */
                <div className="bg-white rounded-2xl border border-natural-border p-5 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow relative overflow-hidden">
                  
                  {/* Visual decorativo de prontuário */}
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-natural-light opacity-30">
                    <FileText className="w-24 h-24 text-natural-border" />
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between border-b border-natural-border pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-natural-light text-natural-primary rounded-lg shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-serif italic font-bold text-natural-dark text-sm leading-tight max-w-[160px] truncate" title={rep.title}>
                            {rep.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            Oficial - {new Date(rep.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Controle Editor se Logado */}
                      {isAdmin && (
                        <div className="flex items-center gap-1.5" id={`report-admin-panel-${rep.id}`}>
                          {deletingReportId !== rep.id ? (
                            <>
                              <button
                                onClick={() => startEdit(rep)}
                                className="p-1 hover:bg-natural-light rounded text-natural-primary transition-colors cursor-pointer"
                                title="Editar parâmetros do laudo"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingReportId(rep.id)}
                                className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400 transition-colors cursor-pointer"
                                title="Excluir documento"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-0.5 rounded shadow-xs">
                              <span className="text-[8px] font-extrabold text-rose-700 uppercase px-0.5">Excluir?</span>
                              <button
                                onClick={() => {
                                  onDeleteReport(rep.id);
                                  setDeletingReportId(null);
                                }}
                                className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[8px] rounded cursor-pointer"
                              >
                                Sim
                              </button>
                              <button
                                onClick={() => setDeletingReportId(null)}
                                className="px-1.5 py-0.5 bg-slate-500 hover:bg-slate-600 text-white font-extrabold text-[8px] rounded cursor-pointer"
                              >
                                Não
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-xs font-sans text-slate-600">
                      <p className="flex items-center gap-1.5 leading-none">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Profissional: <strong className="text-natural-dark">{rep.doctorName}</strong> ({rep.doctorCRM})</span>
                      </p>
                      
                      <p className="flex items-center gap-1.5 leading-none">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                        <span>Especialidade: <span className="font-medium text-natural-dark">{rep.specialty}</span></span>
                      </p>

                      <div className="bg-natural-light p-2.5 rounded-lg border border-natural-border mt-1">
                        <span className="block text-[9px] uppercase font-bold text-natural-primary tracking-wider mb-0.5">Diagnose CID-11</span>
                        <p className="font-semibold text-natural-dark text-[11px] leading-tight font-mono">{rep.diagnosis}</p>
                      </div>

                      {rep.notes && (
                        <p className="text-[11px] text-slate-400 leading-normal italic mt-1.5 shrink-0 line-clamp-2" title={rep.notes}>
                          "{rep.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ações de Visualização e Download do Simulado */}
                  <div className="mt-4 pt-3 border-t border-natural-border flex items-center justify-between gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rep.fileName} ({rep.fileSize})
                    </span>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => setPreviewReport(rep)}
                        className="px-2 h-7 rounded text-[10px] font-bold text-natural-dark bg-natural-light hover:bg-natural-border border border-natural-border flex items-center gap-0.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> Ver
                      </button>
                      <button
                        onClick={() => {
                          alert(`Simulando download do laudo original: ${rep.fileName} em formato PDF seguro.`);
                        }}
                        className="px-2 h-7 rounded text-[10px] font-bold text-white bg-natural-primary hover:bg-natural-primary-dark flex items-center gap-0.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Baixar
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}

        {reports.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Nenhum laudo anexado neste momento. Ative o modo editor com o PIN para cadastrar ou anexar um relatório médico.
          </div>
        )}
      </div>

      {/* MODAL DE VISUALIZAÇÃO INTERATIVA DO LAUDO (SIMULADOR DE PDF CLÍNICO) */}
      <AnimatePresence>
        {previewReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-natural-dark/60 backdrop-blur-sm" onClick={() => setPreviewReport(null)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-natural-border overflow-hidden z-10"
              id="medical-document-viewer"
            >
              <div className="p-4 bg-natural-dark text-white flex items-center justify-between">
                <span className="font-serif italic font-semibold text-xs uppercase tracking-wider text-natural-accent">
                  Visualizador Integrado de Prontuários Médicos
                </span>
                <button
                  onClick={() => setPreviewReport(null)}
                  className="p-1 rounded-lg hover:bg-natural-primary text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                >
                  Fechar
                </button>
              </div>

              {/* Corpo imitando uma folha timbrada clinica profissional */}
              <div className="p-8 sm:p-10 space-y-6 bg-[#FDFCFB]/95 max-h-[75vh] overflow-y-auto">
                {/* Cabeçalho Clínico Timbrado */}
                <div className="border-b-2 border-natural-border pb-5 text-center space-y-1.5 relative">
                  <div className="absolute left-0 top-0 text-natural-border/30">
                    <Stethoscope className="w-12 h-12 stroke-1" />
                  </div>
                  <h3 className="font-serif italic font-bold text-natural-dark text-lg uppercase tracking-wide">
                    {previewReport.doctorName}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest leading-none">
                    {previewReport.specialty} — {previewReport.doctorCRM}
                  </p>
                  <p className="text-[10px] text-slate-400 italic font-serif">Clínica Integrada de Estimulação Precoce e Neurodesenvolvimento</p>
                </div>

                {/* Subtítulo central */}
                <div className="text-center pt-2">
                  <h4 className="font-serif italic font-bold text-natural-dark text-[15px] uppercase tracking-wider">
                    {previewReport.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">Emitido em {new Date(previewReport.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                </div>

                {/* Dados do Paciente e Relatório */}
                <div className="space-y-4 text-xs font-sans text-slate-700 leading-relaxed border-t border-b border-natural-border/40 py-4">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Identificação do Paciente</span>
                    <p className="font-bold text-natural-dark">Gabriel Moraes Matos</p>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Dossiê e Sumário Diagnóstico / CID</span>
                    <p className="font-mono font-semibold text-natural-dark bg-white border border-natural-border p-2 rounded mt-1">
                      {previewReport.diagnosis}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Evolução Clínica Notável</span>
                    <p className="whitespace-pre-line text-slate-600 bg-white border border-natural-border/30 p-3 rounded mt-1 shadow-inner italic">
                      "{previewReport.notes}"
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight">
                    *Este laudo clínico compõe formalmente o prontuário de doador social estabelecido pela mãe de Gabriel Moraes Matos. Para acessar os originais carimbados, faça o download do arquivo PDF completo clicando no botão abaixo.
                  </p>
                </div>

                {/* Assinatura Timbrada */}
                <div className="pt-6 flex flex-col items-center text-center space-y-1">
                  <div className="w-48 border-b border-dashed border-natural-border" />
                  <p className="font-semibold text-natural-dark text-[11px]">{previewReport.doctorName}</p>
                  <p className="text-[10px] text-slate-400 leading-none">{previewReport.doctorCRM} | {previewReport.specialty}</p>
                </div>
              </div>

              {/* Rodapé Ações */}
              <div className="p-4 bg-natural-light border-t border-natural-border flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-mono">
                  {previewReport.fileName} ({previewReport.fileSize})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      alert(`Baixando o arquivo ${previewReport.fileName} na sua máquina...`);
                    }}
                    className="h-9 px-4 rounded-lg bg-natural-accent hover:bg-natural-accent-hover text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Baixar PDF Original
                  </button>
                  <button
                    onClick={() => setPreviewReport(null)}
                    className="h-9 px-4 rounded-lg bg-natural-border/30 hover:bg-natural-border/60 text-natural-dark font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Fechar Prontuário
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
