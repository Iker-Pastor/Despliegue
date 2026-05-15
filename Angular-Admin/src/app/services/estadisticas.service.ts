import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GlobalStats {
  Voluntarios_Activos: number;
  Eventos_Finalizados: number;
  Total_Basura: number;
}

export interface Recoleccion {
  id: number;
  evento: {
    idEvento: number;
    titulo: string;
    fechaInicio: string;
  };
  cantidad_recolectada: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api';

  getGlobalStats(): Observable<GlobalStats> {
    return this.http.get<GlobalStats>(`${this.apiUrl}/estadisticas/globales`, { withCredentials: true });
  }

  getRecoleccionHistory(): Observable<Recoleccion[]> {
    return this.http.get<Recoleccion[]>(`${this.apiUrl}/recoleccion_residuos`, { withCredentials: true });
  }

  getUsuariosCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/usuarios/count`, { withCredentials: true });
  }

  getEventosCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/eventos/count`, { withCredentials: true });
  }
}
