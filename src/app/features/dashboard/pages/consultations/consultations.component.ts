import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Inquiry } from '../../models/inquiry.model';
import { ConsultationService } from '../../services/consultation.service';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'ink-consultations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './consultations.component.html',
  styleUrl: './consultations.component.scss'
})
export class ConsultationsComponent {
  private consultationService = inject(ConsultationService);

  public consultations$: Observable<Inquiry[]>;

  public displayedColumns: string[] = ['createdAt', 'name', 'email', 'status', 'actions'];

  constructor() {
    this.consultations$ = this.consultationService.getConsultations();
  }
}
