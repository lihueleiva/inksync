import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConsultationService } from '../../services/consultation.service';
import { Inquiry } from '../../models/inquiry.model';
import { Client } from '../../models/client.model';
import { ClientService } from '../../services/client.service';
import { Observable, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppointmentFormDialogComponent } from '../../components/appointment-form-dialog/appointment-form-dialog.component';

@Component({
  selector: 'ink-consultation-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './consultation-detail.component.html',
  styleUrl: './consultation-detail.component.scss'
})
export class ConsultationDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private consultationService = inject(ConsultationService);
  private clientService = inject(ClientService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  public consultation = toSignal(this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id')!;
      if (!id) {
        this.router.navigate(['/dashboard/consultations']);
        throw new Error('No ID provided');
      }
      return this.consultationService.getConsultationById(id);
    })
  ));

  public statuses: Inquiry['status'][] = ['Nueva', 'En Revisión', 'Cotizada', 'Agendada', 'Descartada'];

  async onStatusChange(newStatus: Inquiry['status']) {
    const id = this.consultation()?.id;
    if (!id) return;
    try {
      await this.consultationService.updateConsultationStatus(id, newStatus);
      this.snackBar.open('Estado actualizado con éxito', 'Cerrar', { duration: 3000 });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      this.snackBar.open('Error al actualizar el estado', 'Cerrar', { duration: 3000 });
    }
  }

  async convertToAppointment(): Promise<void> {
    const currentConsultation = this.consultation();
    if (!currentConsultation) return;

    try {
      const newClientData = {
        firstName: currentConsultation.name,
        lastName: '(Desde Consulta)',
        email: currentConsultation.email,
        phone: currentConsultation.phone || ''
      };

      const clientDocRef = await this.clientService.addClient(newClientData);
      const newClient: Client = { ...newClientData, id: clientDocRef.id, createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } };

      const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
        data: {
          client: newClient,
          date: new Date(currentConsultation.createdAt.seconds * 1000)
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onStatusChange('Agendada');
          this.snackBar.open('¡Cita creada y consulta agendada!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/calendar']);
        }
      });

    } catch (error) {
      console.error("Error al convertir la consulta:", error);
      this.snackBar.open('Error al crear el cliente', 'Cerrar', { duration: 3000 });
    }
  }
}
