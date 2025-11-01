export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  idea: string;
  bodyPart: string;
  size: string;
  imageUrl?: string | null;
  createdAt: { seconds: number; nanoseconds: number; };
  status: 'Nueva' | 'En Revisión' | 'Cotizada' | 'Agendada' | 'Descartada';
}
