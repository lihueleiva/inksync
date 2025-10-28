import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Inquiry } from '../models/inquiry.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private firestore = inject(Firestore);

  getConsultations(): Observable<Inquiry[]> {
    const inquiriesCollection = collection(this.firestore, 'inquiries');

    const inquiriesQuery = query(inquiriesCollection, orderBy('createdAt', 'desc'));

    return collectionData(inquiriesQuery, { idField: 'id' }) as Observable<Inquiry[]>;
  }
}
