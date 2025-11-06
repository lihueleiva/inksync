import { Injectable, inject, computed } from '@angular/core';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private userUid = computed(() => this.authService.currentUser()?.uid);

  private getAppointmentsCollection() {
    const uid = this.userUid();
    if (!uid) throw new Error('Usuario no autenticado');
    return collection(this.firestore, `artists/${uid}/appointments`);
  }

  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    const uid = this.userUid();
    if (!uid) return of([]);

    const startOfDay = Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)));
    const endOfDay = Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)));

    const appointmentsQuery = query(
      this.getAppointmentsCollection(),
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay)
    );

    return collectionData(appointmentsQuery, { idField: 'id' }) as Observable<Appointment[]>;
  }

  addAppointment(appointmentData: any): Promise<any> {
    const dataWithTimestamp = {
      ...appointmentData,
      date: Timestamp.fromDate(appointmentData.date)
    };
    return addDoc(this.getAppointmentsCollection(), dataWithTimestamp);
  }
}
