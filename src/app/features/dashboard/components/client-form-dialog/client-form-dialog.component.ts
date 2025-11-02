import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ink-client-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './client-form-dialog.component.html',
  styleUrl: './client-form-dialog.component.scss'
})
export class ClientFormDialogComponent {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  public dialogRef = inject(MatDialogRef<ClientFormDialogComponent>);
  public data: Client | null = inject(MAT_DIALOG_DATA, { optional: true });

  public clientForm: FormGroup;
  public isEditMode = false;

  constructor() {
    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    if (this.data) {
      this.isEditMode = true;
      this.clientForm.patchValue(this.data);
    }
  }

  async onSave(): Promise<void> {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    try {
      if (this.isEditMode && this.data) {
        await this.clientService.updateClient(this.data.id, this.clientForm.value);
      } else {
        await this.clientService.addClient(this.clientForm.value);
      }
      this.dialogRef.close(true);
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
