import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Client } from '../../models/client.model';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  private clientService = inject(ClientService);


  public data: { client: Client, date: Date } | null = inject(MAT_DIALOG_DATA, { optional: true });

  public appointmentForm: FormGroup;
  public statuses: string[] = ['Confirmada', 'Pendiente', 'Cancelada'];

  public clients = toSignal(this.clientService.getClients(), {
    initialValue: []
  });

  constructor() {
    this.appointmentForm = this.fb.group({
      client: [null, Validators.required],
      date: [new Date(), Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: [''],
      status: ['Confirmada', Validators.required]
    });


    if (this.data) {
      this.appointmentForm.patchValue({
        client: this.data.client,
        date: this.data.date
      });
    }
  }

  async onSave(): Promise<void> {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const { client, date, startTime, endTime, description, status } = this.appointmentForm.value;

    const appointmentData = {
      clientName: `${client.firstName} ${client.lastName}`,
      clientId: client.id,
      date: date,
      startTime: startTime,
      endTime: endTime,
      description: description,
      status: status
    };

    try {
      await this.appointmentService.addAppointment(appointmentData);
      this.dialogRef.close(true);
    } catch (error) {
      console.error("Error al guardar la cita:", error);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
