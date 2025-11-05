import { Injectable, inject } from '@angular/core';
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
import { Observable } from 'rxjs';
import { PortfolioItem } from '../models/portfolio-item.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private portfolioCollection = collection(this.firestore, 'portfolio');


  getPortfolioItems(): Observable<PortfolioItem[]> {
    const itemsQuery = query(this.portfolioCollection, orderBy('createdAt', 'desc'));
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

    await addDoc(this.portfolioCollection, dataToSave);
  }

  async deletePortfolioItem(item: PortfolioItem): Promise<void> {

    const storageRef = ref(this.storage, item.storagePath);

    const docRef = doc(this.firestore, 'portfolio', item.id);

    await Promise.all([
      deleteObject(storageRef),
      deleteDoc(docRef)
    ]);
  }

  private async uploadPortfolioImage(file: File): Promise<{ imageUrl: string, storagePath: string }> {
    try {
      const filePath = `portfolio/${new Date().getTime()}_${file.name}`;
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
