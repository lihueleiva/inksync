import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// --- Módulos de Angular Material ---
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ink-contact-form-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // <-- Módulo clave para formularios reactivos
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './contact-form-section.component.html',
  styleUrl: './contact-form-section.component.scss'
})
export class ContactFormSectionComponent {
  // Inyectamos el FormBuilder, una herramienta para crear formularios complejos fácilmente.
  private fb = inject(FormBuilder);

  // Definimos la estructura de nuestro formulario.
  public inquiryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''], // Opcional
    idea: ['', [Validators.required, Validators.minLength(20)]],
    bodyPart: ['', Validators.required],
    size: ['', Validators.required],
    referenceImages: [null]
  });

  // Datos para el selector de la parte del cuerpo.
  public bodyParts = [
    'Brazo', 'Antebrazo', 'Pierna', 'Pantorrilla', 'Espalda', 'Pecho', 'Hombro', 'Otro'
  ];

  public fileName: string | null = null;

  // Método que se llama cuando el usuario selecciona un archivo.
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.inquiryForm.patchValue({ referenceImages: file });
      this.fileName = file.name;
    }
  }

  // Método que se ejecutará al enviar el formulario.
  onSubmit(): void {
    if (this.inquiryForm.valid) {
      console.log('Formulario Enviado:', this.inquiryForm.value);
      // Aquí, en el futuro, llamaremos a una función de Firebase para guardar los datos.
      alert('¡Consulta enviada con éxito!');
      this.inquiryForm.reset();
      this.fileName = null;
    } else {
      console.error('El formulario no es válido.');
      this.inquiryForm.markAllAsTouched();
    }
  }
}
