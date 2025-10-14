export interface Tattoo {
  id: number;
  imageUrl: string;
  category: 'Realismo' | 'Tradicional' | 'Blackwork' | 'Color';
  description: string;
}
