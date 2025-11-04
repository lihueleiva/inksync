import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private firestore = inject(Firestore);
  private appointmentsCollection = collection(this.firestore, 'appointments');

  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    const startOfDay = Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)));
    const endOfDay = Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)));

    const appointmentsQuery = query(
      this.appointmentsCollection,
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
    return addDoc(this.appointmentsCollection, dataWithTimestamp);
  }
}
