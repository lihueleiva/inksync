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
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentFormDialogComponent } from '../../components/appointment-form-dialog/appointment-form-dialog.component'; // <-- AÑADIR

@Component({
  selector: 'ink-calendar',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatDatepickerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private appointmentService = inject(AppointmentService);
  private dialog = inject(MatDialog); // <-- AÑADIR

  public selectedDate = signal<Date | null>(new Date());
  private selectedDate$ = toObservable(this.selectedDate);

  private appointments$: Observable<Appointment[]> = this.selectedDate$.pipe(
    switchMap(date => {
      if (!date) return of([]);
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

  openAddAppointmentDialog(): void {
    const dialogRef = this.dialog.open(AppointmentFormDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Cita creada exitosamente');
      }
    });
  }
}
