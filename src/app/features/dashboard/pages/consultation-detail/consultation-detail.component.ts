import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConsultationService } from '../../services/consultation.service';
import { Inquiry } from '../../models/inquiry.model';
import { Observable, switchMap, tap } from 'rxjs';

// --- Módulos de Angular Material ---
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule
  ],
  templateUrl: './consultation-detail.component.html',
  styleUrl: './consultation-detail.component.scss'
})
export class ConsultationDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private consultationService = inject(ConsultationService);
  private snackBar = inject(MatSnackBar);

  public consultation$: Observable<Inquiry>;
  private consultationId!: string;

  public statuses: Inquiry['status'][] = ['Nueva', 'En Revisión', 'Cotizada', 'Agendada', 'Descartada'];

  constructor() {
    this.consultation$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.consultationId = params.get('id')!;
        if (!this.consultationId) {
          this.router.navigate(['/dashboard/consultations']);
          throw new Error('No ID provided');
        }
        return this.consultationService.getConsultationById(this.consultationId);
      })
    );
  }

  async onStatusChange(newStatus: Inquiry['status']) {
    try {
      await this.consultationService.updateConsultationStatus(this.consultationId, newStatus);
      this.snackBar.open('Estado actualizado con éxito', 'Cerrar', { duration: 3000 });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      this.snackBar.open('Error al actualizar el estado', 'Cerrar', { duration: 3000 });
    }
  }
}
