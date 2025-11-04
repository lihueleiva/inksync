import { Injectable, inject } from '@angular/core';
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
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private firestore = inject(Firestore);
  private clientsCollection = collection(this.firestore, 'clients');


  addClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<any> {
    const data = {
      ...client,
      createdAt: new Date()
    };
    return addDoc(this.clientsCollection, data);
  }


  getClients(): Observable<Client[]> {
    const clientsQuery = query(this.clientsCollection, orderBy('firstName', 'asc'));
    return collectionData(clientsQuery, { idField: 'id' }) as Observable<Client[]>;
  }


  updateClient(clientId: string, data: Partial<Client>): Promise<void> {
    const docRef = doc(this.firestore, 'clients', clientId);
    return updateDoc(docRef, data);
  }


  deleteClient(clientId: string): Promise<void> {
    const docRef = doc(this.firestore, 'clients', clientId);
    return deleteDoc(docRef);
  }
}
