import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Noticia {
  idNoticia: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  estadoAprobacionNoticia: string;
  fechaPublicacion: string;
  estadoVisibilidad: boolean;
  citaDestacada?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/noticias';

  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.apiUrl, { withCredentials: true });
  }

  deleteNoticia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createNoticia(noticia: any): Observable<any> {
    return this.http.post(this.apiUrl, noticia, { withCredentials: true });
  }

  updateNoticia(noticia: any): Observable<any> {
    return this.http.put(this.apiUrl, noticia, { withCredentials: true });
  }
}
