import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClientFormDialogComponent } from '../../components/client-form-dialog/client-form-dialog.component';

@Component({
  selector: 'ink-clients',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  private clientService = inject(ClientService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public clients = toSignal(this.clientService.getClients(), {
    initialValue: []
  });

  public displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];

  constructor() { }

  addClient(): void {
    const dialogRef = this.dialog.open(ClientFormDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Cliente añadido con éxito', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // --- ASEGÚRATE DE QUE ESTE MÉTODO ESTÉ ASÍ ---
  editClient(client: Client): void {
    const dialogRef = this.dialog.open(ClientFormDialogComponent, {
      data: client
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Cliente actualizado con éxito', 'Cerrar', { duration: 3000 });
      }
    });
  }

  async deleteClient(clientId: string): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.')) {
      try {
        await this.clientService.deleteClient(clientId);
        this.snackBar.open('Cliente eliminado', 'Cerrar', { duration: 3000 });
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        this.snackBar.open('Error al eliminar el cliente', 'Cerrar', { duration: 3000 });
      }
    }
  }
}
