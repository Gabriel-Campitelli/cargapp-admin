import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface CrearQrDto {
  surtidor: number;
  combustible: 'Súper' | 'Premium' | 'Diésel';
  tipo: 'monto' | 'litros';
  valor: number;
  venceMin: number;
  nota?: string;
}

export interface QrCreated {
  id: string;
  status: 'Pendiente' | 'Pagado' | 'Vencido';
  paymentUrl: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class QrService {
  private baseUrl = '/api'; // o environment.apiBaseUrl

  constructor(private http: HttpClient) {}

  crearQr(payload: CrearQrDto): Observable<QrCreated> {
    return of({
      id: '1',
      status: 'Pendiente',
      paymentUrl: 'olis',
      createdAt: new Date().toISOString(),
    } as QrCreated); // this.http.post<QrCreated>(`${this.baseUrl}/qrs`, payload);
  }
}
