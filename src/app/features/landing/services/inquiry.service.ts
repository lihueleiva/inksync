import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  private readonly ARTIST_UID = "Fu1BVvXvwacttornEmUmmqHA1lV2";

  private inquiriesCollection = collection(this.firestore, `artists/${this.ARTIST_UID}/inquiries`);

  async submitInquiry(inquiryForm: FormGroup): Promise<any> {
    const formData = inquiryForm.value;
    let imageUrl: string | null = null;
    let storagePath: string | null = null;

    if (formData.referenceImages) {
      const uploadResult = await this.uploadReferenceImage(formData.referenceImages);
      imageUrl = uploadResult.imageUrl;
      storagePath = uploadResult.storagePath;
    }

    const dataToSave = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      idea: formData.idea,
      bodyPart: formData.bodyPart,
      size: formData.size,
      imageUrl: imageUrl,
      storagePath: storagePath,
      createdAt: new Date(),
      status: 'Nueva'
    };

    return addDoc(this.inquiriesCollection, dataToSave);
  }

  private async uploadReferenceImage(file: File): Promise<{ imageUrl: string, storagePath: string }> {
    try {
      const filePath = `artists/${this.ARTIST_UID}/references/${new Date().getTime()}_${file.name}`;
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
