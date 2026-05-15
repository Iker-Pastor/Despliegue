import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Organizacion {
  idOrganizacion: number;
  nombreOrganizacion: string;
  descripcion: string;
  sitioWeb?: string;
  logo?: string;
  localidad?: string;
  telefono: string;
  email: string;
  estadoAprobacion: string;
  fechaAprobacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizacionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/organizaciones';

  getOrganizaciones(): Observable<Organizacion[]> {
    return this.http.get<Organizacion[]>(this.apiUrl, { withCredentials: true });
  }

  deleteOrganizacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  updateOrganizacion(id: number, org: any, imagen?: File): Observable<any> {
    const formData = new FormData();
    formData.append('organizacion', new Blob([JSON.stringify(org)], { type: 'application/json' }));
    if (imagen) formData.append('imagen', imagen);
    return this.http.put(`${this.apiUrl}/${id}`, formData, { withCredentials: true });
  }
  
  approveOrganizacion(id: number): Observable<any> {
    return this.updateOrganizacion(id, { estadoAprobacion: 'APROBADO' });
  }

  rejectOrganizacion(id: number): Observable<any> {
    return this.updateOrganizacion(id, { estadoAprobacion: 'RECHAZADO' });
  }
}
