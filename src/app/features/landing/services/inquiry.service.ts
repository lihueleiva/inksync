import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private firestore = inject(Firestore);

  private inquiriesCollection = collection(this.firestore, 'inquiries');

  submitInquiry(inquiryData: FormGroup): Promise<any> {
    const data = {
      ...inquiryData.value,
      createdAt: new Date(),
      status: 'Nueva'
    };

    delete data.referenceImages;

    return addDoc(this.inquiriesCollection, data);
  }
}
