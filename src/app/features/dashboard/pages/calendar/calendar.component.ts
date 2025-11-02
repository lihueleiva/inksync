import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { Observable, of, switchMap } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ink-calendar',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatDatepickerModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private appointmentService = inject(AppointmentService);

  public selectedDate = signal<Date | null>(new Date());

  private selectedDate$ = toObservable(this.selectedDate);

  private appointments$: Observable<Appointment[]> = this.selectedDate$.pipe(
    switchMap(date => {
      if (!date) {
        return of([]);
      }
      return this.appointmentService.getAppointmentsByDate(date);
    })
  );

  public appointmentsForSelectedDay = toSignal(this.appointments$, {
    initialValue: []
  });

  onDateSelected(date: Date | null): void {
    if (date) {
      this.selectedDate.set(date);
    }
  }
}
