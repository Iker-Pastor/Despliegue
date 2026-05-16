import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LogActividad {
  id: number;
  accion: string;
  entidad: string;
  usuario: string;
  detalle: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/logs/actividad';

  getLogs(): Observable<LogActividad[]> {
    return this.http.get<LogActividad[]>(this.apiUrl, { withCredentials: true });
  }
}
