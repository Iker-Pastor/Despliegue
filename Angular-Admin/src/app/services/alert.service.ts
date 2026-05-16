import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

export interface AlertOptions {
  title: string;
  message: string;
  type: AlertType;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSignal = signal<AlertOptions | null>(null);
  private resolveFn: ((value: boolean) => void) | null = null;

  get alert() {
    return this.alertSignal.asReadonly();
  }

  showAlert(options: AlertOptions): Promise<boolean> {
    this.alertSignal.set(options);
    return new Promise((resolve) => {
      this.resolveFn = resolve;
    });
  }

  confirm(title: string, message: string, type: AlertType = 'warning'): Promise<boolean> {
    return this.showAlert({
      title,
      message,
      type,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    });
  }

  success(title: string, message: string): Promise<boolean> {
    return this.showAlert({
      title,
      message,
      type: 'success',
      confirmButtonText: 'Aceptar',
      showCancelButton: false
    });
  }

  error(title: string, message: string): Promise<boolean> {
    return this.showAlert({
      title,
      message,
      type: 'danger',
      confirmButtonText: 'Cerrar',
      showCancelButton: false
    });
  }

  close(result: boolean) {
    this.alertSignal.set(null);
    if (this.resolveFn) {
      this.resolveFn(result);
      this.resolveFn = null;
    }
  }
}
