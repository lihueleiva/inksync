export interface PortfolioItem {
  id: string;
  imageUrl: string;
  storagePath: string;
  category: 'Realismo' | 'Tradicional' | 'Blackwork' | 'Color';
  description?: string;
  createdAt: { seconds: number; nanoseconds: number; };
}
