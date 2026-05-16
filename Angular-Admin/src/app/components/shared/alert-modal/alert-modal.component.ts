import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (alertService.alert(); as options) {
      <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.6); z-index: 2000;">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
          <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="p-4 text-center">
              <div class="mb-3">
                @if (options.type === 'success') {
                  <div class="display-1 text-success"><i class="bi bi-check-circle-fill"></i></div>
                } @else if (options.type === 'danger') {
                  <div class="display-1 text-danger"><i class="bi bi-x-circle-fill"></i></div>
                } @else if (options.type === 'warning') {
                  <div class="display-1 text-warning"><i class="bi bi-exclamation-triangle-fill"></i></div>
                } @else {
                  <div class="display-1 text-info"><i class="bi bi-info-circle-fill"></i></div>
                }
              </div>
              
              <h4 class="fw-bold mb-2">{{ options.title }}</h4>
              <p class="text-secondary mb-4">{{ options.message }}</p>
              
              <div class="d-flex gap-2 justify-content-center">
                @if (options.showCancelButton) {
                  <button type="button" class="btn btn-light px-4 rounded-3 fw-semibold" (click)="close(false)">
                    {{ options.cancelButtonText || 'Cancelar' }}
                  </button>
                }
                <button type="button" class="btn px-4 rounded-3 fw-semibold" 
                        [ngClass]="'btn-' + options.type"
                        (click)="close(true)">
                  {{ options.confirmButtonText || 'Aceptar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .display-1 { font-size: 5rem; }
  `]
})
export class AlertModalComponent {
  public readonly alertService = inject(AlertService);

  close(result: boolean) {
    this.alertService.close(result);
  }
}
