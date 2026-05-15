import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: boolean;
  eventosCompletados: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/usuarios';

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { withCredentials: true });
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createUsuario(usuario: any, imagen?: File): Observable<any> {
    const formData = new FormData();
    formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    if (imagen) formData.append('imagen', imagen);
    return this.http.post(this.apiUrl, formData, { withCredentials: true });
  }

  updateUsuario(id: number, usuario: any, imagen?: File): Observable<any> {
    const formData = new FormData();
    formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    if (imagen) formData.append('imagen', imagen);
    return this.http.put(`${this.apiUrl}/${id}`, formData, { withCredentials: true });
  }
}
