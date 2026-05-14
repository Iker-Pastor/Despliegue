import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  message: string;
  user?: string;
  roles?: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  
  // Utiliza ruta relativa para funcionar a través del proxy inverso Nginx nativamente
  private readonly apiUrl = '/api/auth';

  /**
   * Envía las credenciales de autenticación al backend Spring Boot.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }, {
      withCredentials: true // Permite envío de cookies/sesión de Spring Security
    });
  }

  /**
   * Cierra la sesión activa en el backend.
   */
  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    });
  }
}
