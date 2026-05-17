import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evento {
  idEvento: number;
  titulo: string;
  descripcion?: string;
  imagen?: string;
  ubicacion: string;
  fechaInicio: string;
  fechaFin: string;
  estadoEvento: string;
  participantes: number;
  finalizado?: boolean;
  materialNecesario?: string;
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

  createEvento(evento: any, imagen?: File): Observable<any> {
    const cleanEvento = { ...evento };
    if (cleanEvento.usuario) {
      cleanEvento.usuario = { id: cleanEvento.usuario.id };
    }
    if (cleanEvento.organizacion) {
      cleanEvento.organizacion = { idOrganizacion: cleanEvento.organizacion.idOrganizacion };
    }
    if (cleanEvento.categoria) {
      cleanEvento.categoria = { idCategoria: cleanEvento.categoria.idCategoria };
    }

    const formData = new FormData();
    formData.append('evento', new Blob([JSON.stringify(cleanEvento)], { type: 'application/json' }));
    if (imagen) formData.append('imagen', imagen);
    return this.http.post(this.apiUrl, formData, { withCredentials: true });
  }

  updateEvento(id: number, evento: any, imagen?: File): Observable<any> {
    const cleanEvento = { ...evento };
    if (cleanEvento.usuario) {
      cleanEvento.usuario = { id: cleanEvento.usuario.id };
    }
    if (cleanEvento.organizacion) {
      cleanEvento.organizacion = { idOrganizacion: cleanEvento.organizacion.idOrganizacion };
    }
    if (cleanEvento.categoria) {
      cleanEvento.categoria = { idCategoria: cleanEvento.categoria.idCategoria };
    }

    const formData = new FormData();
    formData.append('evento', new Blob([JSON.stringify(cleanEvento)], { type: 'application/json' }));
    if (imagen) formData.append('imagen', imagen);
    return this.http.put(`${this.apiUrl}/${id}`, formData, { withCredentials: true });
  }
}
