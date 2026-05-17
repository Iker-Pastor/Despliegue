import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService, Evento } from '../../../services/evento.service';
import { InscripcionesService, Participante } from '../../../services/inscripciones.service';
import { AlertService } from '../../../services/alert.service';
import { forkJoin } from 'rxjs';

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
  private readonly inscripcionesService = inject(InscripcionesService);
  private readonly alertService = inject(AlertService);
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

  // Participants Modal
  showParticipantsModal = signal<boolean>(false);
  participants = signal<Participante[]>([]);
  isLoadingParticipants = signal<boolean>(false);
  currentEventoId: number | null = null;
  currentEventoFinalizado = signal<boolean>(false);

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

  // Participants Logic
  openParticipantsModal(evento: Evento) {
    this.currentEventoId = evento.idEvento;
    this.currentEventoFinalizado.set(evento.finalizado || false);
    this.showParticipantsModal.set(true);
    this.loadParticipants(evento.idEvento);
  }

  loadParticipants(id: number) {
    this.isLoadingParticipants.set(true);
    forkJoin({
      participantes: this.inscripcionesService.getParticipantes(id),
      asistentes: this.inscripcionesService.getAsistentes(id)
    }).subscribe({
      next: ({ participantes, asistentes }) => {
        // Mapear la asistencia comparando si el participante está en la lista de asistentes confirmados
        const mapped = participantes.map(p => {
          p.asistio = asistentes.some(a => a.id === p.id);
          return p;
        });
        this.participants.set(mapped);
        this.isLoadingParticipants.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoadingParticipants.set(false);
      }
    });
  }

  toggleCheckIn(idUsuario: number, currentStatus: boolean) {
    if (!this.currentEventoId || !this.currentEventoFinalizado()) return;
    
    this.inscripcionesService.updateAsistencia(this.currentEventoId, idUsuario, !currentStatus).subscribe({
      next: () => {
        this.loadParticipants(this.currentEventoId!);
      },
      error: (err) => console.error(err)
    });
  }

  closeParticipantsModal() {
    this.showParticipantsModal.set(false);
    this.participants.set([]);
    this.currentEventoId = null;
    this.currentEventoFinalizado.set(false);
  }

  cancelarEvento(evento: Evento) {
    this.alertService.confirm('Cancelar evento', `¿Estás seguro de cancelar el evento "${evento.titulo}"?`).then(confirmed => {
      if (confirmed) {
        const updatedEvento = { ...evento, estadoEvento: 'CANCELADO' };
        this.eventoService.updateEvento(evento.idEvento, updatedEvento).subscribe({
          next: () => {
            this.loadEventos();
            this.alertService.success('Completado', 'Evento cancelado correctamente');
          },
          error: (err: any) => {
            console.error(err);
            this.alertService.error('Error', 'Error al cancelar evento');
          }
        });
      }
    });
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
        this.alertService.success('Guardado', 'Evento guardado correctamente');
      },
      error: (err: any) => {
        console.error(err);
        this.alertService.error('Error', err.error?.error || 'Error al guardar evento. Asegúrate de que las fechas y campos obligatorios son correctos.');
      }
    });
  }
}
