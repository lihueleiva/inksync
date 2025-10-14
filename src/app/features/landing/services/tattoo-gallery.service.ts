import { Injectable, signal } from '@angular/core';
import { Tattoo } from '../models/tattoo.model';

const TATTOO_DATA: Tattoo[] = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1571572837513-25ac25a52824?w=800', category: 'Realismo', description: 'Retrato en blanco y negro' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1555511454-a95914172764?w=800', category: 'Tradicional', description: 'Ancla tradicional' },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1617880155321-4d434cb27f0f?w=800', category: 'Blackwork', description: 'Diseño geométrico' },
  { id: 4, imageUrl: 'https://images.unsplash.com/photo-1628175459312-9a393a5b6f3c?w=800', category: 'Color', description: 'Tatuaje de acuarela' },
  { id: 5, imageUrl: 'https://images.unsplash.com/photo-1614050941913-9556d9c6c345?w=800', category: 'Realismo', description: 'Ojo realista' },
  { id: 6, imageUrl: 'https://images.unsplash.com/photo-1542045090-b17953264627?w=800', category: 'Blackwork', description: 'Manga ornamental' },
];

@Injectable({
  providedIn: 'root'
})
export class TattooGalleryService {

  private tattoos = signal<Tattoo[]>(TATTOO_DATA);

  public readonly tattoos$ = this.tattoos.asReadonly();

  constructor() { }
}
