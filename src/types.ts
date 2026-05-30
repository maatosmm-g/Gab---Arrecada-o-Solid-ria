export interface Campaign {
  id: string;
  title: string;
  patientName: string;
  bio: string;
  detailedStory: string;
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  verifiedStatus: 'verificado' | 'pendente' | 'em_analise';
  verificationDate: string;
  motherName: string;
  location: string;
  primaryImage: string;
  primaryMediaType?: 'image' | 'video';
  primaryVideo?: string;
  images: Array<{ id: string; url: string; caption: string; imageFit?: 'cover' | 'contain' }>;
  pixKey?: string;
  whatsappNumber?: string;
  dossierCards?: Array<{ id: string; label: string; value: string }>;
  miniCards?: Array<{ id: string; label: string; value: string }>;
  recurrentTitle?: string;
  recurrentDesc?: string;
  videos?: Array<{ id: string; url: string; caption?: string }>;
  shortTermObjectives?: string;
  shortTermFontSize?: string;
  shortTermTextColor?: string;
  shortTermFontWeight?: string;
  shortTermIsItalic?: boolean;
  shortTermBgColor?: string;
}

export interface TransparencyItem {
  id: string;
  description: string;
  category: 'Saúde' | 'Terapias' | 'Medicamentos' | 'Educação' | 'Adaptação' | 'Acessibilidade' | 'Outros';
  amount: number;
  status: 'previsto' | 'pago' | 'agendado';
  date: string;
  notes?: string;
}

export interface UpdateItem {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'Marco Financeiro' | 'Tratamento' | 'Dia a Dia' | 'Agradecimento' | 'Novidades';
  imageUrl?: string;
  viewsCount: number;
  imageFit?: 'cover' | 'contain';
}

export interface MedicalReport {
  id: string;
  title: string;
  doctorName: string;
  doctorCRM: string;
  specialty: string;
  date: string;
  diagnosis: string;
  notes: string;
  fileName: string;
  fileSize: string;
}

export interface PINConfig {
  currentPIN: string;
  securityQuestion: string;
  securityAnswer: string;
}

export interface Contributor {
  id: string;
  name: string;
  amount: number;
  date: string;
  isRecurring: boolean;
  message?: string;
}
