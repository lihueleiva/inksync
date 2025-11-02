import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private firestore = inject(Firestore);
  private appointmentsCollection = collection(this.firestore, 'appointments');

  // Obtiene las citas para un día específico
  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    // 1. Crear las marcas de tiempo para el inicio y el fin del día
    const startOfDay = Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)));
    const endOfDay = Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)));

    // 2. Crear la consulta (query) a Firestore
    const appointmentsQuery = query(
      this.appointmentsCollection,
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay)
    );

    // 3. Devolver los resultados como un Observable
    return collectionData(appointmentsQuery, { idField: 'id' }) as Observable<Appointment[]>;
  }
}
