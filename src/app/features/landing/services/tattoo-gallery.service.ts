import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Tattoo } from '../models/tattoo.model';

@Injectable({
  providedIn: 'root'
})
export class TattooGalleryService {
  private firestore = inject(Firestore);

  private readonly ARTIST_UID = "Fu1BVvXvwacttornEmUmmqHA1lV2";

  private portfolioCollection = collection(this.firestore, `artists/${this.ARTIST_UID}/portfolio`);

  getTattoos(): Observable<Tattoo[]> {
    const tattoosQuery = query(this.portfolioCollection, orderBy('createdAt', 'desc'));

    return collectionData(tattoosQuery, { idField: 'id' }) as Observable<Tattoo[]>;
  }
}
