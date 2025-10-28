import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
  doc,
  docData,
  updateDoc
} from '@angular/fire/firestore';
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

  getConsultationById(id: string): Observable<Inquiry> {
    const docRef = doc(this.firestore, 'inquiries', id);
    return docData(docRef, { idField: 'id' }) as Observable<Inquiry>;
  }

  updateConsultationStatus(id: string, newStatus: Inquiry['status']): Promise<void> {
    const docRef = doc(this.firestore, 'inquiries', id);
    return updateDoc(docRef, { status: newStatus });
  }
}
