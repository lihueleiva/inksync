import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioItem } from '../../models/portfolio-item.model';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'ink-portfolio-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './portfolio-manager.component.html',
  styleUrl: './portfolio-manager.component.scss'
})
export class PortfolioManagerComponent {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private snackBar = inject(MatSnackBar);

  public portfolioForm: FormGroup;
  private selectedFile: File | null = null;
  public fileName = signal<string | null>(null);
  public isLoading = signal(false);

  public categories: PortfolioItem['category'][] = ['Realismo', 'Tradicional', 'Blackwork', 'Color'];


  public portfolioItems = toSignal(this.portfolioService.getPortfolioItems(), {
    initialValue: []
  });

  constructor() {
    this.portfolioForm = this.fb.group({
      category: ['', Validators.required],
      description: [''],
      imageFile: [null, Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName.set(this.selectedFile.name);
      this.portfolioForm.patchValue({ imageFile: this.selectedFile });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.portfolioForm.invalid || !this.selectedFile) {
      return;
    }

    this.isLoading.set(true);
    const { category, description } = this.portfolioForm.value;

    try {
      await this.portfolioService.addPortfolioItem(this.selectedFile, category, description);
      this.snackBar.open('¡Trabajo subido con éxito!', 'Cerrar', { duration: 3000 });

      this.portfolioForm.reset();
      this.fileName.set(null);
      this.selectedFile = null;
    } catch (error) {
      console.error("Error al subir el trabajo:", error);
      this.snackBar.open('Error al subir el trabajo', 'Cerrar', { duration: 3000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  async onDelete(item: PortfolioItem): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar este trabajo? Esta acción no se puede deshacer.')) {
      try {
        await this.portfolioService.deletePortfolioItem(item);
        this.snackBar.open('Trabajo eliminado', 'Cerrar', { duration: 3000 });
      } catch (error) {
        console.error('Error al eliminar el trabajo:', error);
        this.snackBar.open('Error al eliminar el trabajo', 'Cerrar', { duration: 3000 });
      }
    }
  }
}
