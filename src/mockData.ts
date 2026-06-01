import { Campaign, TransparencyItem, UpdateItem, MedicalReport, PINConfig, Contributor, ShopProduct } from './types';

// Dados iniciais reais para a jornada do Gabriel Moraes Matos
export const initialCampaign: Campaign = {
  id: "campanhas-gabriel",
  title: "Amor em Tom de Samba: A Jornada de Desenvolvimento de Gabriel Moraes Matos",
  patientName: "Gabriel Moraes Matos",
  bio: "Comunidade solidária para as terapias de reabilitação neurológica, fonoaudiologia, musicoterapia e inclusão social do Gabriel.",
  detailedStory: "Gabriel Moraes Matos é um menino alegre, carismático e apaixonado por música, ritmo e natureza. Ele usa seus emblemáticos óculos de armação azul e se destaca pelo sorriso e pela energia contagiante. Gabriel enfrenta desafios contínuos associados ao desenvolvimento neurológico e motor, que demandam um conjunto multidisciplinar de terapias especializadas e acompanhamento de longo prazo.\n\nA música desempenha um papel milagroso em sua evolução! De braços abertos para o mundo, Gabriel participa ativamente de rodas de samba comunitárias, tocando percussão e integrando-se socialmente através da arte. Suas sessões de musicoterapia, combinadas com fisioterapia de integração sensorial (que inclui estímulos como subir em árvores e explorar espaços abertos), mudaram radicalmente sua qualidade de vida, autonomia e expressão verbal.\n\nPara que esse desenvolvimento não seja interrompido, criamos esta plataforma. Nosso objetivo não é fazer apenas uma 'vaquinha online' comum, mas sim convidar você a fazer parte desse ecossistema solidário contínuo, onde cada centavo apoia diretamente fonoaudiologia, terapia ocupacional e apoio familiar continuado.",
  targetAmount: 48000,
  raisedAmount: 31250,
  donorCount: 247,
  verifiedStatus: "verificado",
  verificationDate: "2026-04-15",
  motherName: "Fernanda Moraes Matos",
  location: "Porto Alegre - RS",
  primaryImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800", // Criança alegre
  primaryMediaType: "image",
  primaryVideo: "",
  pixKey: "00020126580014br.gov.bcb.pix0136apoio.gabriel.moraes.matos.sol52040000530398654",
  whatsappNumber: "51999999999",
  dossierCards: [
    { id: "dc-1", label: "Beneficiário", value: "Gabriel Moraes Matos" },
    { id: "dc-2", label: "Mãe / Administradora", value: "Fernanda Moraes Matos" },
    { id: "dc-3", label: "Origem / Respeito", value: "Porto Alegre - RS" },
    { id: "dc-4", label: "Status de Verificação", value: "Identidade Aprovada" }
  ],
  miniCards: [
    { id: "mc-1", label: "Causa Primária", value: "Desenvolvimento Neurológico" },
    { id: "mc-2", label: "Urgência", value: "Sessões Continuadas" }
  ],
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600",
      caption: "Sinfonia do Cuidado: Gabriel e sua mãe em momento de afeto e transporte diário para clínicas de Estimulação Cognitiva"
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?auto=format&fit=crop&q=80&w=600",
      caption: "Ritmo e Inclusão: Participação interativa em rodas de percussão e festivais locais de samba"
    },
    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
      caption: "Hora da Leitura: O livro personalizado com o menino de óculos azuis estimulando a dedicação escolar"
    },
    {
      id: "img-4",
      url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600",
      caption: "Fisioterapia ao Ar Livre: Foco na coordenação motora grossa através de brincadeiras e escaladas seguras"
    }
  ],
  recurrentTitle: "Por que a Recorrência é Vital?",
  recurrentDesc: "A fonoaudiologia, o neuropediatra e a terapia ocupacional sensorial não são pontuais — são tratamentos cumulativos e permanentes. Garantir uma base de apoiadores mensais protege a rotina do Gabriel de interrupções.",
  shortTermObjectives: "• Viabilizar mais 12 sessões mensais integradas de Terapia Ocupacional Sensorial.\n• Adquirir o novo jogo de óculos ergonômicos adaptativos com lentes anti-reflexo especiais.\n• Garantir a continuidade do suporte fonoaudiológico semanal focado na fluência da fala.",
  shortTermFontSize: "text-xs",
  shortTermTextColor: "text-slate-800",
  shortTermFontWeight: "font-medium",
  shortTermIsItalic: true,
  shortTermBgColor: "bg-[#FCFAF2]/80",
  videos: [
    {
      id: "vid-1",
      url: "https://youtube.com/shorts/scDKbW4e_Kc?si=joj_keRH_N7dA6Oy",
      caption: "Gabriel tocando percussão com alegria na roda de samba comunitária!"
    },
    {
      id: "vid-2",
      url: "https://youtube.com/shorts/scDKbW4e_Kc?si=qOUnlSyUQZciRSkV",
      caption: "Sessão de musicoterapia e estimulação rítmica do Gabriel!"
    }
  ]
};

export const initialTransparency: TransparencyItem[] = [
  {
    id: "trans-1",
    description: "Sessões Trimestrais de Fonoaudiologia Especializada (Método PROMPT)",
    category: "Terapias",
    amount: 7200,
    status: "pago",
    date: "2026-05-10",
    notes: "Melhoria na coordenação motora da fala e deglutição, focado em comunicação funcional."
  },
  {
    id: "trans-2",
    description: "Mensalidade de Integração Sensorial na Terapia Ocupacional",
    category: "Terapias",
    amount: 4800,
    status: "pago",
    date: "2026-05-20",
    notes: "Essencial para processamento sensorial e regulação de comportamento e foco diário."
  },
  {
    id: "trans-3",
    description: "Acompanhamento em Musicoterapia e Prática Rítmica de Percussão",
    category: "Terapias",
    amount: 3600,
    status: "pago",
    date: "2026-05-25",
    notes: "Estimulação cognitiva e rítmica que acelerou o desenvolvimento de fala do Gabriel."
  },
  {
    id: "trans-4",
    description: "Renovação de Lentes Corretivas e Armação Reforçada (Estilo Azul)",
    category: "Acessibilidade",
    amount: 1150,
    status: "pago",
    date: "2026-05-02",
    notes: "Armação flexível resistente a impacto para suporte das atividades rítmicas e esportivas."
  },
  {
    id: "trans-5",
    description: "Neuropediatra - Consulta Semestral de Ajuste de Conduta",
    category: "Saúde",
    amount: 900,
    status: "previsto",
    date: "2026-06-15",
    notes: "Acompanhamento de desenvolvimento com Dr. Alexandre Lima, agendado para o próximo mês."
  },
  {
    id: "trans-6",
    description: "Suplementação Alimentar e Vitaminas de Absorção Neurológica",
    category: "Medicamentos",
    amount: 1850,
    status: "previsto",
    date: "2026-06-10",
    notes: "Enxoval trimestral de suplementação recomendada pela nutricionista integrativa."
  }
];

export const initialUpdates: UpdateItem[] = [
  {
    id: "up-1",
    title: "Gabriel brilha na roda de samba comunitária e comove o público!",
    date: "2026-05-24",
    content: "Ontem foi um dia emocionante! Gabriel participou do encontro musical local. Com seu tambor, acompanhou o ritmo perfeitamente e vibrou a cada música. A inclusão através da música tem sido o melhor estimulador de linguagem dele. Agradecemos imensamente a todos que contribuem para manter viva a assinatura das sessões de fonoaudiologia e musicoterapia!",
    category: "Dia a Dia",
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=500",
    viewsCount: 142
  },
  {
    id: "up-2",
    title: "Conquista Motora: Gabriel escala árvore sob supervisão terapêutica",
    date: "2026-05-12",
    content: "Durante as atividades de praça com a terapeuta ocupacional, Gabriel praticou equilíbrio escalando um tronco de árvore de baixa altura. A superação de medos e o ganho de tônus muscular nas pernas é nítido. Ele estava radiante! É a nossa vitória diária, de galho em galho.",
    category: "Tratamento",
    imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=500",
    viewsCount: 98
  },
  {
    id: "up-3",
    title: "Relatório de Marco: Alcançamos 65% da nossa meta graças a vocês!",
    date: "2026-05-01",
    content: "Estamos abrindo as contas do trimestre para transparência máxima. Com o valor arrecadado, quitamos o primeiro semestre das sessões PROMPT e garantimos a manutenção imediata dos remédios. Muito obrigado a cada apoiador recorrente!",
    category: "Marco Financeiro",
    viewsCount: 81
  }
];

export const initialMedicalReports: MedicalReport[] = [
  {
    id: "rep-1",
    title: "Laudo Neuropsicológico de Evolução Cognitiva",
    doctorName: "Dra. Clarice Mendes Castro",
    doctorCRM: "CRM/RS 34211",
    specialty: "Neuropsicologia Infantil",
    date: "2026-04-10",
    diagnosis: "Acompanhamento de Transtorno do Desenvolvimento Neurológico",
    notes: "Apresenta evidente melhora na atenção compartilhada e interação rítmica. Recomendada continuidade absoluta de TO e Musicoterapia.",
    fileName: "laudo_neuropsicologico_gabriel_2026.pdf",
    fileSize: "1.4 MB"
  },
  {
    id: "rep-2",
    title: "Atestado Clínico para Fins de Subsídio Terapêutico",
    doctorName: "Dr. Alexandre Lima Fontes",
    doctorCRM: "CRM/RS 19875",
    specialty: "Neuropediatra",
    date: "2025-11-20",
    diagnosis: "CID 10 F84.0 / CID 11 6A02",
    notes: "Necessidade de estímulo sensorial intensivo devido à disfunção de processamento integrativo. Requer prótese visual com grau corrigido e flexível.",
    fileName: "atestado_neuropediatra_gabriel.pdf",
    fileSize: "890 KB"
  },
  {
    id: "rep-3",
    title: "Relatório de Evolução da Fonoaudiologia Funcional",
    doctorName: "Fga. Renata Vasconcellos",
    doctorCRM: "CRFa 4ªR - 8511",
    specialty: "Fonoaudiologia Integrada",
    date: "2026-03-15",
    notes: "Foco no controle de práxis de fala. Demonstra excelente engajamento vocal com mediação baseada na melodia e percussão assistida.",
    fileName: "relatorio_fono_marco_2026.pdf",
    fileSize: "1.1 MB",
    diagnosis: "Dificuldade de Planejamento Motor de Fala"
  }
];

export const defaultPINConfig: PINConfig = {
  currentPIN: "1234",
  securityQuestion: "Qual é o primeiro nome do menino beneficiado por esta campanha solidária?",
  securityAnswer: "gabriel"
};

export const initialContributors: Contributor[] = [
  { id: "cont-1", name: "Marcio Silva", amount: 150, date: "2026-05-29", isRecurring: true, message: "Força Gabriel! Esse samba é seu!" },
  { id: "cont-2", name: "Patrícia Medeiros", amount: 100, date: "2026-05-28", isRecurring: false, message: "Com muito amor para o coração azul." },
  { id: "cont-3", name: "Carlos Eduardo", amount: 200, date: "2026-05-28", isRecurring: true, message: "Que a musicoterapia continue fazendo milagres!" },
  { id: "cont-4", name: "Luciana G. Rocha", amount: 50, date: "2026-05-27", isRecurring: false, message: "De grão em grão ajudamos." },
  { id: "cont-5", name: "Roberto Ramos (Samba do Amor)", amount: 300, date: "2026-05-26", isRecurring: true, message: "Toca forte esse repique, Gabriel!" }
];

export const initialProducts: ShopProduct[] = [
  {
    id: "prod-1",
    title: "Camiseta Oficial SuperAção Gabi",
    description: "Camiseta personalizada de algodão egípcio macio com a arte exclusiva do super-herói Gabriel Moraes Matos. Confortável e durável, perfeita para vestir a causa solidária.",
    price: 60,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
    category: "Camisas",
    optionsLabel: "Tamanhos",
    options: ["Infantil 4", "Infantil 6", "Infantil 8", "P", "M", "G", "GG"],
    isAvailable: true
  },
  {
    id: "prod-2",
    title: "Caneca Hermética de Cerâmica",
    description: "Caneca cerâmica de alta qualidade, ideal para café, chá ou cacau quente. Estampada com a ilustração vivaz do Gabriel de óculos azuis e carisma contagiante.",
    price: 45,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
    category: "Utensílios",
    optionsLabel: "Fundo / Cor Interna",
    options: ["Branco Neve", "Laranja Sol", "Azul Celeste"],
    isAvailable: true
  },
  {
    id: "prod-3",
    title: "Garrafa / Squeeze de Alumínio",
    description: "Squeeze esportiva de alumínio leve para hidratação ativa no dia a dia. Tampa de rosca segura de altíssima vedação com gancho chaveiro de transporte.",
    price: 55,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600",
    category: "Utensílios",
    optionsLabel: "Acabamento",
    options: ["Branco Brilhante", "Inox Escovado (Térmico)"],
    isAvailable: true
  },
  {
    id: "prod-4",
    title: "Cuia Artesanal de Chimarrão",
    description: "Tradicional cuia de madeira tratada com gravação a laser da marca oficial 'SuperAção Gabi'. Um toque de respeito e união com a cultura gaúcha para sua roda de mate.",
    price: 75,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600",
    category: "Tradição",
    optionsLabel: "Gravação",
    options: ["Logo Herói Completo", "Amor em Tom de Samba"],
    isAvailable: true
  },
  {
    id: "prod-5",
    title: "Boné Premium SuperAção Gabi",
    description: "Boné de aba curva trucker ou clássico com fecho ajustável. Possui bordado frontal resistente de alta definição para espalhar essa corrente colorida onde você for.",
    price: 40,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600",
    category: "Acessórios",
    optionsLabel: "Estilo & Cor",
    options: ["Preto Absoluto", "Branco/Azul Trucker", "Branco Clean"],
    isAvailable: true
  },
  {
    id: "prod-6",
    title: "Sacochila Esportiva Ajustável",
    description: "Sacochila de tecido sintético respirável super leve e à prova d'água. Ideal para carregar os pertences do parquinho com alça anatômica dupla de cordão.",
    price: 30,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600",
    category: "Acessórios",
    optionsLabel: "Cor do Cordão",
    options: ["Cordão Preto", "Cordão Azul Royal"],
    isAvailable: true
  },
  {
    id: "prod-7",
    title: "Estojo Escolar Pencil Case",
    description: "Estojo organizador compacto personalizado com zíper metálico de alta durabilidade. Perfeito para guardar lápis de cor e materiais escolares de estimulação motora fina.",
    price: 25,
    image: "https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?auto=format&fit=crop&q=80&w=600",
    category: "Papelaria",
    optionsLabel: "Zíper & Detalhe",
    options: ["Branco Tradicional", "Azul Estrelado"],
    isAvailable: true
  },
  {
    id: "prod-8",
    title: "Caderno Espiral / Notbook Gabi",
    description: "Caderneta de anotações capa dura com espiral robusto, pautas macias e espaço para datas. Acompanha selo de doador ativo nas contracapas.",
    price: 35,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=600",
    category: "Papelaria",
    optionsLabel: "Tipo de Miolo",
    options: ["Folhas Pautadas", "Folhas em Branco (Desenho)"],
    isAvailable: true
  }
];

