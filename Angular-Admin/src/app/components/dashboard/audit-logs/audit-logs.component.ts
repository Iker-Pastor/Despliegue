import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService, LogActividad } from '../../../services/audit.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h3 fw-bold text-secondary mb-0">Logs de Auditoría</h2>
      <button class="btn btn-outline-primary btn-sm" (click)="loadLogs()">
        <i class="bi bi-arrow-clockwise"></i> Actualizar
      </button>
    </div>

    <div class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Entidad</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            @for (log of logs(); track log.id) {
              <tr>
                <td class="small text-muted">{{ log.fecha | date:'medium' }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm bg-primary-soft text-primary me-2 rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                      {{ log.usuario ? log.usuario.substring(0, 1).toUpperCase() : 'S' }}
                    </div>
                    <span class="fw-medium">{{ log.usuario || 'SISTEMA' }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success-soft': log.accion === 'CREATE',
                    'bg-info-soft': log.accion === 'UPDATE',
                    'bg-danger-soft': log.accion === 'DELETE',
                    'bg-secondary-soft': !['CREATE', 'UPDATE', 'DELETE'].includes(log.accion)
                  }">{{ log.accion }}</span>
                </td>
                <td><span class="text-uppercase small fw-bold">{{ log.entidad }}</span></td>
                <td class="text-wrap" style="max-width: 300px;">{{ log.detalle }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="bi bi-journal-text fs-1 d-block mb-2"></i>
                  No hay registros de actividad todavía.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .bg-success-soft { background-color: rgba(25, 135, 84, 0.1); color: #198754; }
    .bg-info-soft { background-color: rgba(13, 202, 240, 0.1); color: #0dcaf0; }
    .bg-danger-soft { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; }
    .bg-secondary-soft { background-color: rgba(108, 117, 125, 0.1); color: #6c757d; }
    .bg-primary-soft { background-color: rgba(13, 110, 253, 0.1); color: #0d6efd; }
  `]
})
export class AuditLogsComponent {
  private readonly auditService = inject(AuditService);
  logs = signal<LogActividad[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    afterNextRender(() => {
      this.loadLogs();
    });
  }

  loadLogs() {
    this.isLoading.set(true);
    this.auditService.getLogs().subscribe({
      next: (data) => {
        // Procesar defensivamente en caso de que la fecha venga como un array o formato inesperado
        const processed = data.map(log => {
          if (Array.isArray(log.fecha)) {
            const [year, month, day, hours, minutes, seconds] = log.fecha;
            log.fecha = new Date(
              year,
              (month || 1) - 1,
              day || 1,
              hours || 0,
              minutes || 0,
              seconds || 0
            ).toISOString();
          }
          return log;
        });
        this.logs.set(processed.reverse()); // Los más recientes primero
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading logs:', err);
        this.isLoading.set(false);
      }
    });
  }
}
