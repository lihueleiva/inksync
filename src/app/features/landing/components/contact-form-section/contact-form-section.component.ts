import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InquiryService } from '../../services/inquiry.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'ink-contact-form-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './contact-form-section.component.html',
  styleUrl: './contact-form-section.component.scss'
})
export class ContactFormSectionComponent {
  private fb = inject(FormBuilder);
  private inquiryService = inject(InquiryService);

  public isLoading = signal(false);

  public inquiryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    idea: ['', [Validators.required, Validators.minLength(20)]],
    bodyPart: ['', Validators.required],
    size: ['', Validators.required],
    referenceImages: [null]
  });

  public bodyParts = [
    'Brazo', 'Antebrazo', 'Pierna', 'Pantorrilla', 'Espalda', 'Pecho', 'Hombro', 'Otro'
  ];

  public fileName: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.inquiryForm.patchValue({ referenceImages: file });
      this.fileName = file.name;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    try {
      await this.inquiryService.submitInquiry(this.inquiryForm);
      alert('¡Consulta enviada con éxito! Nos pondremos en contacto contigo pronto.');
      this.inquiryForm.reset();
      this.fileName = null;
    } catch (error) {
      console.error('Error al enviar la consulta:', error);
      alert('Hubo un error al enviar tu consulta. Por favor, inténtalo de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
