import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, QrCode, ClipboardCopy, Check, Heart, MessageCircle, Sparkles, User, ShieldCheck } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessPay: (amount: number, isRecurring: boolean, name?: string, message?: string) => void;
  patientName: string;
  pixKey?: string;
  isSimulationMode?: boolean;
}

export default function DonationModal({ isOpen, onClose, onSuccessPay, patientName, pixKey, isSimulationMode = true }: DonationModalProps) {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(true); // Default recurring
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Credit Card Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const [donorName, setDonorName] = useState('');
  const [donorMessage, setDonorMessage] = useState('');

  const handlePrefillSimulation = () => {
    setAmount(100);
    setCustomAmount('');
    setDonorName('Apoiador de Testes 🚀');
    setDonorMessage('Simulando o PIX para testar o financeiro! Funcionando perfeito! 👏');
  };

  const donationTiers = [
    { value: 25, label: 'R$ 25', impact: 'Apoia material didático-musical para 1 semana.' },
    { value: 50, label: 'R$ 50', impact: 'Garante 1 sessão de Musicoterapia adaptada.' },
    { value: 100, label: 'R$ 100', impact: 'Garante 1 sessão de Fonoaudiologia método PROMPT.' },
    { value: 250, label: 'R$ 250', impact: 'Garante 1 semana inteira de terapias multidisciplinares.' },
  ];

  const activeAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleSelectTier = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value.replace(/\D/g, ''));
  };

  const handleCopyPix = () => {
    const finalPix = pixKey || `00020126580014br.gov.bcb.pix0136apoio.gabriel.moraes.matos.sol5204000053039865405${activeAmount.toFixed(2)}5802BR5925Gabriel Moraes Matos Camp6009Porto Alegre62070503***6304D1B8`;
    navigator.clipboard.writeText(finalPix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAmount <= 0) return;
    setIsSubmitting(true);

    // Simulate server side delay
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessPay(activeAmount, isRecurring, donorName, donorMessage);
      setStep('success');
    }, 1500);
  };

  const shareText = `Acabei de apoiar a caminhada do Gabriel Moraes Matos e contribuir para a manutenção das terapias de integração sensorial e fonoaudiologia dele. Vamos ajudar também? Entre em: ${window.location.href}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10"
            id="donation-checkout-modal"
          >
               {/* Header */}
            <div className="p-5 border-b border-natural-border flex items-center justify-between bg-natural-light">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-natural-accent fill-natural-accent" />
                <span className="font-serif italic font-bold text-natural-dark text-base">
                  {step === 'form' ? 'Efetuar Doação Solidária' : 'Doação Processada! 🎉'}
                </span>
                {isRecurring && step === 'form' && (
                  <span className="px-2.5 py-0.5 text-[10px] bg-natural-primary/10 text-natural-primary rounded-full font-bold">
                    Recorrente Mensal
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-natural-border/30 transition-all focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === 'form' ? (
              <form onSubmit={handleSubmitPayment} className="p-5 space-y-4 overflow-y-auto flex-1 max-h-[calc(90vh-80px)] scrollbar-thin">
                {/* Tipo de recorrência */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-natural-border/30 rounded-xl animate-fadeIn" id="recurrence-selector">
                  <button
                    type="button"
                    onClick={() => setIsRecurring(true)}
                    className={`h-8 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      isRecurring
                        ? 'bg-white text-natural-primary shadow-xs'
                        : 'text-[#444430]/75 hover:text-natural-dark'
                    }`}
                  >
                    Apoio Recorrente (Mensal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRecurring(false)}
                    className={`h-8 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      !isRecurring
                        ? 'bg-white text-natural-primary shadow-xs'
                        : 'text-[#444430]/75 hover:text-natural-dark'
                    }`}
                  >
                    Doação Única
                  </button>
                </div>

                {/* Seleção de valores */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#444430] block">Escolha o valor da contribuição:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {donationTiers.map((tier) => (
                      <button
                        key={tier.value}
                        type="button"
                        onClick={() => handleSelectTier(tier.value)}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 focus:outline-none cursor-pointer ${
                          amount === tier.value && !customAmount
                            ? 'bg-natural-primary border-natural-primary text-white'
                            : 'bg-white border-natural-border text-slate-700 hover:border-natural-primary hover:bg-natural-light'
                        }`}
                      >
                        <span>{tier.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Valor personalizado */}
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2 text-xs text-natural-primary font-bold">Outro Valor (R$)</span>
                    <input
                      type="text"
                      className="w-full h-8 pl-24 pr-3 bg-white rounded-lg border border-natural-border text-xs font-bold focus:border-natural-primary outline-none transition-all text-right"
                      placeholder="0,00"
                      value={customAmount}
                      onChange={handleCustomChange}
                    />
                  </div>

                  {/* Impacto demonstrado do valor selecionado */}
                  <div className="bg-natural-light border border-natural-border/70 p-2.5 rounded-lg text-xs text-natural-dark flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-natural-accent mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-serif italic font-bold text-natural-primary text-[11px]">Demonstração de Impacto:</p>
                      <p className="text-[10.5px] text-slate-600 leading-snug mt-0.5">
                        {customAmount
                          ? `Com R$ ${activeAmount}, você fortalece o fundo de reserva médica para o custeio emergencial da saúde do Gabriel.`
                          : donationTiers.find((t) => t.value === amount)?.impact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Método de pagamento */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#444430] block">Forma de Pagamento:</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`h-9 rounded-lg border flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                        paymentMethod === 'pix'
                          ? 'border-natural-primary bg-natural-light text-natural-primary shadow-xs'
                          : 'border-natural-border bg-white text-slate-600 hover:border-natural-primary'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-natural-accent" />
                      PIX Instantâneo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`h-9 rounded-lg border flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-natural-accent bg-natural-light/50 text-[#F27D26] shadow-xs'
                          : 'border-natural-border bg-white text-slate-600 hover:border-natural-primary'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-natural-primary" />
                      Cartão de Crédito
                    </button>
                  </div>
                </div>

                {/* Detalhes específicos de pagamento */}
                {paymentMethod === 'pix' ? (
                  <div className="p-3 bg-natural-light border border-natural-border/70 rounded-xl flex items-center gap-3.5 animate-fadeIn">
                    <div className="p-1 px-1.5 bg-white border border-natural-border/60 rounded-lg shrink-0">
                      {/* Compact Simulated QR Code */}
                      <div className="w-16 h-16 bg-white flex items-center justify-center text-slate-300 rounded font-mono text-[9px] relative select-none">
                        <QrCode className="w-12 h-12 text-[#5A5A40] opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-natural-accent text-white rounded-full px-1.5 py-0.5 text-[7px] font-bold shadow-xs">PIX</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0 text-left">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Leia o QR Code ou copie o código PIX:</p>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          readOnly
                          className="w-full h-8 px-2 bg-white rounded border border-natural-border text-[9.5px] font-mono text-slate-550 select-all outline-none"
                          value={pixKey || "00020126580014br.gov.bcb.pix0136apoio.gabriel.moraes.matos.sol52040000530398654..."}
                        />
                        <button
                          type="button"
                          onClick={handleCopyPix}
                          className="px-3.5 h-8 text-xs font-bold bg-natural-accent hover:bg-natural-accent-hover text-white rounded transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" /> Copiado
                            </>
                          ) : (
                            <>
                              <ClipboardCopy className="w-3 h-3" /> Copiar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 bg-natural-light/40 p-3.5 rounded-xl border border-natural-border/70 animate-fadeIn">
                    <p className="text-[10.5px] font-bold text-natural-primary uppercase tracking-wider font-semibold">Dados do Cartão de Crédito</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        className="w-full h-8 px-2.5 bg-white rounded-md border border-natural-border text-xs focus:border-natural-primary outline-none font-medium"
                        placeholder="Nome impresso no cartão"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        className="w-full h-8 px-2.5 bg-white rounded-md border border-natural-border text-xs focus:border-natural-primary outline-none font-mono"
                        placeholder="Número do Cartão (16 dígitos)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                      />
                      <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                        <input
                          type="text"
                          required
                          maxLength={5}
                          className="h-8 px-2.5 bg-white rounded-md border border-natural-border text-xs text-center focus:border-natural-primary outline-none font-medium"
                          placeholder="Validade (MM/AA)"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                        <input
                          type="password"
                          required
                          maxLength={3}
                          className="h-8 px-2.5 bg-white rounded-md border border-natural-border text-xs text-center focus:border-natural-primary outline-none font-mono"
                          placeholder="CVV"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[9.5px] text-slate-400">
                      <ShieldCheck className="w-3 h-3 text-natural-primary" />
                      Transação segura em ambiente certificado.
                    </div>
                  </div>
                )}

                {/* Nome do Doador e Mensagem Opcionais */}
                <div className="space-y-2 p-3 bg-slate-50 border border-natural-border/70 rounded-xl">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-natural-primary" />
                      <span className="text-[10px] font-bold text-natural-primary uppercase tracking-wider font-mono">Deixe sua Marca Solidária (Opcional)</span>
                    </div>
                    {isSimulationMode && (
                      <button
                        type="button"
                        onClick={handlePrefillSimulation}
                        className="text-[9px] font-extrabold text-white bg-natural-accent hover:bg-natural-accent/90 transition-all px-2 py-0.5 rounded cursor-pointer flex items-center gap-0.5 shadow-2xs"
                        title="Preenche um nome e mensagem de simulação teste para testar o site imediatamente"
                      >
                        ✨ Simular Apoio (Auto-Preencher)
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      className="w-full h-8 px-2.5 bg-white border border-natural-border rounded-md text-xs outline-none focus:border-natural-primary font-medium text-slate-800"
                      placeholder="Seu Nome / Apelido para o Teste (Ex: Engenheiro Claudio)"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                    <input
                      type="text"
                      maxLength={180}
                      className="w-full h-8 px-2.5 bg-white border border-natural-border rounded-md text-xs outline-none focus:border-natural-primary text-slate-705"
                      placeholder="Deixe uma mensagem de carinho de teste..."
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                    />
                  </div>
                </div>

                {/* DICA DE SIMULAÇÃO DE FLUXO INTEGRADO */}
                {isSimulationMode && (
                  <div className="p-2.5 bg-blue-50/65 border border-blue-100 rounded-xl leading-relaxed animate-fadeIn">
                    <div className="flex gap-1.5 items-start">
                      <span className="text-[8px] font-extrabold bg-blue-600 text-white px-1 py-0.5 rounded font-mono uppercase tracking-wider shrink-0 mt-0.5">Modo Simulação</span>
                      <p className="text-[9.5px] text-blue-800 leading-normal">
                        Ao clicar em <strong>Apoiar</strong> abaixo, a plataforma simula a recepção instantânea do PIX. O valor é somado na barra dinâmica, o doador entra no feed de contribuidores em tempo real e o topo exibe o pop-up de sucesso!
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão de envio principal */}
                <button
                  type="submit"
                  disabled={isSubmitting || activeAmount <= 0}
                  className={`w-full h-10 text-xs font-bold rounded-xl text-white transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    isSubmitting || activeAmount <= 0
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-[#F27D26] hover:bg-natural-accent-hover hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando transação solidária...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white shrink-0" />
                      {paymentMethod === 'pix'
                        ? `Apoiar com R$ ${activeAmount} via PIX`
                        : `Apoiar com R$ ${activeAmount} no Cartão`}
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ESTADO DE SUCESSO - CELEBRAÇÃO (PILAR ENGAJAMENTO & IMPACTO) */
              <div className="p-8 text-center space-y-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-natural-light text-natural-accent border border-natural-border rounded-full flex items-center justify-center animate-bounce">
                  <Heart className="w-10 h-10 fill-natural-accent text-natural-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif italic font-bold text-[18px] text-natural-dark leading-tight">
                    Multiplicou Esperança! ❤️
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    Agradecemos imensamente o seu apoio solidário de{' '}
                    <strong className="text-natural-dark">R$ {activeAmount}</strong>{' '}
                    para {' '}
                    <span className="font-bold text-[#F27D26]">{patientName}</span>!
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
                    {isRecurring
                      ? 'Seu apoio mensal recorrente foi configurado e será essencial para dar segurança e sustentabilidade absoluta ao tratamento de longo prazo do Gabriel.'
                      : 'Esta doação pontual garante a execução imediata das despesas e insumos desta semana.'}
                  </p>
                </div>

                <div className="bg-natural-light border border-natural-border rounded-xl p-4 w-full">
                  <span className="text-[10px] text-natural-primary font-bold uppercase tracking-wider block mb-2 font-mono">Engaje sua Rede (Pilar 2)</span>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Você pode impulsionar o alcance da nossa campanha e multiplicar as visitas divulgando para amigos!
                  </p>
                  
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 px-4 rounded-xl font-semibold text-xs text-white bg-natural-accent hover:bg-natural-accent-hover transition-colors flex items-center justify-center gap-2 w-full shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" /> Instigar no WhatsApp
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setCardName('');
                    setCardNumber('');
                    setCardExpiry('');
                    setCardCVV('');
                    setDonorName('');
                    setDonorMessage('');
                    onClose();
                  }}
                  className="px-6 h-9 text-xs font-semibold text-natural-dark bg-natural-border/30 hover:bg-natural-border/60 rounded-lg transition-colors cursor-pointer"
                >
                  Fechar janela
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
