import { Injectable, inject, computed } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Client } from '../models/client.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private userUid = computed(() => this.authService.currentUser()?.uid);

  private getClientsCollection() {
    const uid = this.userUid();
    if (!uid) throw new Error('Usuario no autenticado');
    return collection(this.firestore, `artists/${uid}/clients`);
  }

  addClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<any> {
    const data = {
      ...client,
      createdAt: new Date()
    };
    return addDoc(this.getClientsCollection(), data);
  }

  getClients(): Observable<Client[]> {
    const uid = this.userUid();
    if (!uid) return of([]);
    const clientsQuery = query(this.getClientsCollection(), orderBy('firstName', 'asc'));
    return collectionData(clientsQuery, { idField: 'id' }) as Observable<Client[]>;
  }

  updateClient(clientId: string, data: Partial<Client>): Promise<void> {
    const docRef = doc(this.getClientsCollection(), clientId);
    return updateDoc(docRef, data);
  }

  deleteClient(clientId: string): Promise<void> {
    const docRef = doc(this.getClientsCollection(), clientId);
    return deleteDoc(docRef);
  }
}
