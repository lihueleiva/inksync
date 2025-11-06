import { Injectable, inject, computed } from '@angular/core';
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
import { Observable, of } from 'rxjs';
import { Inquiry } from '../models/inquiry.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private userUid = computed(() => this.authService.currentUser()?.uid);

  private getInquiriesCollection() {
    const uid = this.userUid();
    if (!uid) throw new Error('Usuario no autenticado');
    return collection(this.firestore, `artists/${uid}/inquiries`);
  }

  getConsultations(): Observable<Inquiry[]> {
    const uid = this.userUid();
    if (!uid) return of([]);
    const inquiriesQuery = query(this.getInquiriesCollection(), orderBy('createdAt', 'desc'));
    return collectionData(inquiriesQuery, { idField: 'id' }) as Observable<Inquiry[]>;
  }

  getConsultationById(id: string): Observable<Inquiry> {
    const uid = this.userUid();
    if (!uid) return of();
    const docRef = doc(this.getInquiriesCollection(), id);
    return docData(docRef, { idField: 'id' }) as Observable<Inquiry>;
  }

  updateConsultationStatus(id: string, newStatus: Inquiry['status']): Promise<void> {
    const docRef = doc(this.getInquiriesCollection(), id);
    return updateDoc(docRef, { status: newStatus });
  }
}
