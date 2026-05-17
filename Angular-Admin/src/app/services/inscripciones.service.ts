import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Participante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  foto?: string;
  asistio?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/inscripciones';

  getParticipantes(idEvento: number): Observable<Participante[]> {
    // El backend usa /api/eventos/{id}/inscripciones
    return this.http.get<Participante[]>(`/api/eventos/${idEvento}/inscripciones`, { withCredentials: true });
  }

  getAsistentes(idEvento: number): Observable<Participante[]> {
    // El backend usa /api/eventos/{id}/inscripciones/asistentes
    return this.http.get<Participante[]>(`/api/eventos/${idEvento}/inscripciones/asistentes`, { withCredentials: true });
  }

  updateAsistencia(idEvento: number, idUsuario: number, asistio: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/evento/${idEvento}/usuario/${idUsuario}/check-in`, asistio, { withCredentials: true });
  }
}
