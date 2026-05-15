import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService, Evento } from '../../../services/evento.service';

@Component({
  selector: 'app-eventos-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './eventos-crud.component.html',
  styleUrl: './eventos-crud.component.scss'
})
export class EventosCrudComponent {
  private readonly eventoService = inject(EventoService);
  private readonly fb = inject(FormBuilder);
  
  eventos = signal<Evento[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Modal Control
  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  selectedEvento: Evento | null = null;
  eventoForm: FormGroup;
  selectedFile: File | null = null;

  constructor() {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: [''],
      ubicacion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      participantes: [5, [Validators.min(5)]],
      estadoEvento: ['PENDIENTE'],
      finalizado: [false]
    });

    afterNextRender(() => {
      this.loadEventos();
    });
  }

  loadEventos() {
    this.isLoading.set(true);
    this.eventoService.getEventos().subscribe({
      next: (data: any) => {
        this.eventos.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.error.set('Error al cargar los eventos');
        this.isLoading.set(false);
      }
    });
  }

  cancelarEvento(evento: Evento) {
    if (confirm(`¿Estás seguro de cancelar el evento "${evento.titulo}"?`)) {
      const updatedEvento = { ...evento, estadoEvento: 'CANCELADO' };
      this.eventoService.updateEvento(evento.idEvento, updatedEvento).subscribe({
        next: () => {
          alert('Evento cancelado con éxito');
          this.loadEventos();
        },
        error: (err: any) => {
          console.error(err);
          alert('Error al cancelar evento');
        }
      });
    }
  }

  openAddModal() {
    this.isEditing.set(false);
    this.selectedEvento = null;
    this.eventoForm.reset({ 
      participantes: 5, 
      estadoEvento: 'PENDIENTE', 
      finalizado: false 
    });
    this.showModal.set(true);
  }

  openEditModal(evento: Evento) {
    this.isEditing.set(true);
    this.selectedEvento = evento;
    this.eventoForm.patchValue({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      ubicacion: evento.ubicacion,
      fechaInicio: evento.fechaInicio ? evento.fechaInicio.replace(' ', 'T') : '',
      fechaFin: evento.fechaFin ? evento.fechaFin.replace(' ', 'T') : '',
      participantes: evento.participantes,
      estadoEvento: evento.estadoEvento,
      finalizado: evento.finalizado
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveEvento() {
    if (this.eventoForm.invalid) return;

    // Formatear fechas para el backend (reemplazar T por espacio)
    const formValue = this.eventoForm.value;
    const eventoData = {
      ...this.selectedEvento, // Preservar categoria, usuario, etc.
      ...formValue,
      fechaInicio: formValue.fechaInicio ? formValue.fechaInicio.replace('T', ' ') : null,
      fechaFin: formValue.fechaFin ? formValue.fechaFin.replace('T', ' ') : null
    };

    const obs = this.isEditing() 
      ? this.eventoService.updateEvento(this.selectedEvento!.idEvento, eventoData, this.selectedFile || undefined)
      : this.eventoService.createEvento(eventoData, this.selectedFile || undefined);

    obs.subscribe({
      next: () => {
        this.loadEventos();
        this.closeModal();
      },
      error: (err: any) => {
        console.error(err);
        alert(err.error?.error || 'Error al guardar evento. Asegúrate de que las fechas y campos obligatorios son correctos.');
      }
    });
  }
}
