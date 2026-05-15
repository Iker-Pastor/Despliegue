import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizacionService, Organizacion } from '../../../services/organizacion.service';

@Component({
  selector: 'app-organizaciones-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './organizaciones-crud.component.html',
  styleUrl: './organizaciones-crud.component.scss'
})
export class OrganizacionesCrudComponent {
  private readonly orgService = inject(OrganizacionService);
  private readonly fb = inject(FormBuilder);
  
  organizaciones = signal<Organizacion[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Modal Control
  showModal = signal<boolean>(false);
  selectedOrg = signal<Organizacion | null>(null);
  orgForm: FormGroup;

  constructor() {
    this.orgForm = this.fb.group({
      nombreOrganizacion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      localidad: [''],
      sitioWeb: [''],
      estadoAprobacion: ['PENDIENTE']
    });

    afterNextRender(() => {
      this.loadOrganizaciones();
    });
  }

  loadOrganizaciones() {
    this.isLoading.set(true);
    this.orgService.getOrganizaciones().subscribe({
      next: (data) => {
        this.organizaciones.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar organizaciones');
        this.isLoading.set(false);
      }
    });
  }

  approveOrg(id: number) {
    if (confirm('¿Estás seguro de aprobar esta organización?')) {
      this.orgService.approveOrganizacion(id).subscribe({
        next: () => {
          this.loadOrganizaciones();
        },
        error: (err) => alert('Error al aprobar')
      });
    }
  }

  rejectOrg(id: number) {
    if (confirm('¿Estás seguro de rechazar esta organización?')) {
      this.orgService.rejectOrganizacion(id).subscribe({
        next: () => {
          this.loadOrganizaciones();
        },
        error: (err) => alert('Error al rechazar')
      });
    }
  }

  deleteOrg(id: number) {
    if (confirm('¿Estás seguro de eliminar esta organización permanentemente?')) {
      this.orgService.deleteOrganizacion(id).subscribe({
        next: () => {
          this.loadOrganizaciones();
        },
        error: (err) => alert('Error al eliminar')
      });
    }
  }

  openDetails(org: Organizacion) {
    this.selectedOrg.set(org);
    this.orgForm.patchValue(org);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedOrg.set(null);
  }
}
