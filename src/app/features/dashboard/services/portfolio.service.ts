import { Injectable, inject, computed } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { PortfolioItem } from '../models/portfolio-item.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private authService = inject(AuthService);

  private userUid = computed(() => this.authService.currentUser()?.uid);

  private getPortfolioCollection() {
    const uid = this.userUid();
    if (!uid) throw new Error('Usuario no autenticado');
    return collection(this.firestore, `artists/${uid}/portfolio`);
  }

  getPortfolioItems(): Observable<PortfolioItem[]> {
    const uid = this.userUid();
    if (!uid) return of([]);
    const itemsQuery = query(this.getPortfolioCollection(), orderBy('createdAt', 'desc'));
    return collectionData(itemsQuery, { idField: 'id' }) as Observable<PortfolioItem[]>;
  }

  async addPortfolioItem(
    file: File,
    category: PortfolioItem['category'],
    description: string
  ): Promise<void> {

    const { imageUrl, storagePath } = await this.uploadPortfolioImage(file);

    const dataToSave = {
      imageUrl,
      storagePath,
      category,
      description,
      createdAt: new Date()
    };

    await addDoc(this.getPortfolioCollection(), dataToSave);
  }

  async deletePortfolioItem(item: PortfolioItem): Promise<void> {
    const storageRef = ref(this.storage, item.storagePath);
    const docRef = doc(this.getPortfolioCollection(), item.id);

    await Promise.all([
      deleteObject(storageRef),
      deleteDoc(docRef)
    ]);
  }

  private async uploadPortfolioImage(file: File): Promise<{ imageUrl: string, storagePath: string }> {
    const uid = this.userUid();
    if (!uid) throw new Error('Usuario no autenticado');
    try {
      const filePath = `artists/${uid}/portfolio/${new Date().getTime()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);

      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return { imageUrl: downloadURL, storagePath: filePath };
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw error;
    }
  }
}
