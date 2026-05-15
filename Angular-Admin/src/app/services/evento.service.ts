import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evento {
  idEvento: number;
  titulo: string;
  ubicacion: string;
  fechaInicio: string;
  fechaFin: string;
  estadoEvento: string;
  participantes: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/eventos';

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl, { withCredentials: true });
  }

  deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
