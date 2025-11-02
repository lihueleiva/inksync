import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';

// --- Módulos de Angular Material ---
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'ink-appointment-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  templateUrl: './appointment-form-dialog.component.html',
  styleUrl: './appointment-form-dialog.component.scss'
})
export class AppointmentFormDialogComponent {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  public dialogRef = inject(MatDialogRef<AppointmentFormDialogComponent>);

  public appointmentForm: FormGroup;
  public statuses: string[] = ['Confirmada', 'Pendiente', 'Cancelada'];

  constructor() {
    this.appointmentForm = this.fb.group({
      clientName: ['', Validators.required],
      clientId: ['', Validators.required],
      date: [new Date(), Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: [''],
      status: ['Confirmada', Validators.required]
    });
  }

  async onSave(): Promise<void> {
    if (this.appointmentForm.invalid) {
      return;
    }

    try {
      await this.appointmentService.addAppointment(this.appointmentForm.value);
      this.dialogRef.close(true);
    } catch (error) {
      console.error("Error al guardar la cita:", error);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
