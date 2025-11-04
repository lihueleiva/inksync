export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: { seconds: number; nanoseconds: number; };
  startTime: string;
  endTime: string;
  description: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
}
