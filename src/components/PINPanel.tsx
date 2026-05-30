import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Unlock, Check, Key, HelpCircle, RefreshCw, X, AlertCircle } from 'lucide-react';
import { PINConfig } from '../types';

interface PINPanelProps {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  pinConfig: PINConfig;
  onUpdatePIN: (newPin: string) => void;
}

export default function PINPanel({ isAdmin, setIsAdmin, pinConfig, onUpdatePIN }: PINPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState('');
  
  // Customization of PIN
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Clear states when closing or shifting
  useEffect(() => {
    if (!isOpen) {
      setPinInput('');
      setErrorMsg('');
      setIsRecovering(false);
      setRecoveryAnswer('');
      setRecoverySuccessMsg('');
      setNewPin('');
      setConfirmNewPin('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 4) {
      setPinInput((prev) => prev + num);
      setErrorMsg('');
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPinInput('');
  };

  // Submit entered PIN
  const handleSubmitPin = () => {
    if (pinInput === pinConfig.currentPIN) {
      setIsAdmin(true);
      setErrorMsg('');
      setSuccessMsg('Acesso concedido! Modo Editor ativado com sucesso.');
      setTimeout(() => {
        setSuccessMsg('');
        setIsOpen(false);
      }, 1500);
    } else {
      setErrorMsg('PIN incorreto. Tente novamente ou use a recuperação de código.');
      setPinInput('');
    }
  };

  // Trigger automatically when typed length = 4
  useEffect(() => {
    if (pinInput.length === 4) {
      handleSubmitPin();
    }
  }, [pinInput]);

  // Handle Recovery Submit
  const handleRecoverPIN = () => {
    if (recoveryAnswer.trim().toLowerCase() === pinConfig.securityAnswer.toLowerCase()) {
      setRecoverySuccessMsg(`Gabarito correto! O seu PIN atual é: ${pinConfig.currentPIN}`);
      setErrorMsg('');
    } else {
      setErrorMsg('Resposta incorreta. Dica: O primeiro nome do menino beneficiado.');
    }
  };

  // Handle Changing PIN
  const handleSaveNewPIN = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPin)) {
      setErrorMsg('O PIN deve conter exatamente 4 dígitos numéricos.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setErrorMsg('Os PINs digitados não coincidem.');
      return;
    }
    onUpdatePIN(newPin);
    setSuccessMsg('Seu PIN foi atualizado com sucesso!');
    setNewPin('');
    setConfirmNewPin('');
    setErrorMsg('');
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  return (
    <div className="relative" id="avatar-pin-controller">
      {/* Botão de Trigger com Avatar da Campanha */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-300 focus:outline-none cursor-pointer ${
          isAdmin
            ? 'bg-natural-light border-natural-primary/50 text-natural-primary shadow-xs font-bold'
            : 'bg-white border-natural-border text-slate-700 hover:border-natural-primary hover:shadow-xs'
        }`}
        title="Painel do Organizador (PIN de 4 dígitos)"
        id="btn-trigger-pin-panel"
      >
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=150"
            alt="Gabriel Moraes Matos Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-natural-primary shadow-inner"
            referrerPolicy="no-referrer"
          />
          <span className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-xs ${
            isAdmin ? 'bg-natural-primary' : 'bg-natural-accent'
          }`}>
            {isAdmin ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
          </span>
        </div>
        <div className="flex flex-col items-start leading-none text-left hidden sm:flex">
          <span className="text-[11px] text-slate-400 font-mono tracking-wider">Acesso Restrito</span>
          <span className="text-xs font-semibold font-serif italic text-natural-dark">
            {isAdmin ? 'Modo Editor Ativo' : 'Área do Organizador'}
          </span>
        </div>
      </button>

      {/* Dropdown Modal flutuante */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop discreto */}
            <div
              className="fixed inset-0 z-40 bg-natural-dark/20 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-natural-border z-50 overflow-hidden animate-fade-in"
              id="pin-dropdown-modal"
            >
              <div className="p-4 bg-natural-dark text-natural-light flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-natural-accent" />
                  <span className="font-serif italic font-bold text-sm tracking-wide">
                    Autenticação do Organizador
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-natural-primary-dark transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="p-5">
                {/* Alertas de Erro ou Sucesso */}
                {errorMsg && (
                  <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs rounded-r-lg flex items-start gap-2 animate-bounce">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="mb-4 p-3 bg-natural-light border-l-4 border-natural-primary text-natural-primary text-xs rounded-r-lg flex items-start gap-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* ABA DE RECUPERAÇÃO DE PIN */}
                {isRecovering ? (
                  <div className="space-y-4" id="recovery-flow">
                    <div className="text-slate-600 text-xs leading-relaxed">
                      <p className="font-[#444430] font-bold mb-1">Recuperação de Acesso</p>
                      Para visualizar ou atualizar seu PIN, responda à pergunta de verificação abaixo:
                    </div>

                    <div className="bg-[#FDFCFB]/80 border border-natural-border p-3 rounded-lg text-xs text-natural-primary">
                      <p className="font-semibold flex items-center gap-1.5 text-natural-dark mb-1">
                        <HelpCircle className="w-4 h-4 text-natural-accent" /> Pergunta de Segurança:
                      </p>
                      {pinConfig.securityQuestion}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Sua Resposta</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 rounded-lg border border-natural-border text-sm focus:border-natural-primary outline-none transition-all bg-white"
                        placeholder="Resposta da pergunta"
                        value={recoveryAnswer}
                        onChange={(e) => setRecoveryAnswer(e.target.value)}
                      />
                    </div>

                    {recoverySuccessMsg && (
                      <div className="p-3 bg-natural-light border border-natural-border rounded-lg text-xs text-natural-dark font-mono text-center">
                        {recoverySuccessMsg}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRecovering(false);
                          setRecoveryAnswer('');
                          setRecoverySuccessMsg('');
                          setErrorMsg('');
                        }}
                        className="w-1/2 h-9 text-xs font-semibold text-natural-dark bg-natural-border/30 hover:bg-natural-border/60 rounded-lg transition-colors cursor-pointer"
                      >
                        Voltar para PIN
                      </button>
                      <button
                        type="button"
                        onClick={handleRecoverPIN}
                        className="w-1/2 h-9 text-xs font-semibold text-white bg-natural-accent hover:bg-natural-accent-hover rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" /> Confirmar
                      </button>
                    </div>
                  </div>
                ) : !isAdmin ? (
                  /* MODO BLOQUEADO - FORM DE DIGITAÇÃO DE PIN */
                  <div className="space-y-4" id="pin-login-flow">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Insira seu PIN de 4 dígitos para editar</p>
                      <div className="flex justify-center gap-3 my-4">
                        {[0, 1, 2, 3].map((index) => (
                          <div
                            key={index}
                            className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center font-display font-semibold text-xl transition-all ${
                              pinInput.length > index
                                ? 'border-natural-accent bg-[#FDFCFB] text-natural-dark font-bold shadow-xs animate-pulse-subtle'
                                : 'border-natural-border text-slate-300'
                            }`}
                          >
                            {pinInput.length > index ? '●' : ''}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botões de Teclado Numérico */}
                    <div className="grid grid-cols-3 gap-2 px-6">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleKeyPress(num)}
                          className="h-10 text-sm font-semibold rounded-lg bg-natural-light border border-natural-border/40 hover:bg-natural-border/20 active:bg-natural-border/40 text-natural-dark transition-colors focus:outline-none cursor-pointer"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleClear}
                        className="h-10 text-xs font-semibold rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors focus:outline-none cursor-pointer"
                      >
                        Limpar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeyPress('0')}
                        className="h-10 text-sm font-semibold rounded-lg bg-natural-light border border-natural-border/40 hover:bg-natural-border/20 active:bg-natural-border/40 text-natural-dark transition-colors focus:outline-none cursor-pointer"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="h-10 text-xs font-semibold rounded-lg text-slate-400 bg-natural-light border border-natural-border/40 hover:bg-natural-border/20 transition-colors focus:outline-none cursor-pointer"
                      >
                        Apagar
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setIsRecovering(true)}
                        className="text-xs text-natural-accent hover:underline hover:text-natural-accent-hover font-medium inline-flex items-center gap-1 cursor-pointer font-sans"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> Esqueci meu PIN
                      </button>
                    </div>
                  </div>
                ) : (
                  /* MODO EDITOR DESBLOQUEADO - OPÇÃO DE ALTERAR PIN */
                  <div className="space-y-4" id="pin-settings-flow">
                    <div className="bg-natural-light border border-natural-border p-3 rounded-lg text-xs text-natural-primary flex items-start gap-2 mb-2">
                      <Unlock className="w-4 h-4 shrink-0 mt-0.5 text-natural-accent" />
                      <div>
                        <p className="font-serif italic font-bold text-natural-dark text-xs mb-0.5">Sessão Editor Ativa</p>
                        Você pode editar e excluir histórias, atualizar despesas e gerenciar relatórios com facilidade.
                      </div>
                    </div>

                    <form onSubmit={handleSaveNewPIN} className="space-y-3 pt-2 border-t border-natural-border">
                      <p className="text-xs font-semibold text-natural-dark flex items-center gap-1 font-serif italic">
                        <RefreshCw className="w-3.5 h-3.5 text-natural-primary" /> Alterar PIN do Administrador
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-500 mb-1">Novo PIN (4 dígitos)</label>
                          <input
                            type="password"
                            maxLength={4}
                            className="w-full h-8 px-2 rounded-md border border-natural-border text-center font-mono text-sm focus:border-natural-accent outline-none bg-white"
                            placeholder="****"
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-500 mb-1">Confirmar PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            className="w-full h-8 px-2 rounded-md border border-natural-border text-center font-mono text-sm focus:border-natural-accent outline-none bg-white"
                            placeholder="****"
                            value={confirmNewPin}
                            onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-8 text-xs font-semibold text-white bg-natural-primary hover:bg-natural-primary-dark rounded-md transition-colors cursor-pointer"
                      >
                        Salvar Novo PIN
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setIsAdmin(false)}
                      className="w-full h-9 mt-2 text-xs font-semibold text-white bg-natural-dark hover:bg-black rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" /> Sair do Modo de Edição
                    </button>
                  </div>
                )}
              </div>

              {/* Informação do Default PIN */}
              <div className="bg-natural-light border-t border-natural-border px-4 py-2.5 text-center text-[10px] text-slate-400 font-mono">
                PIN de Teste Padrão: <span className="font-bold text-natural-accent">1234</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
