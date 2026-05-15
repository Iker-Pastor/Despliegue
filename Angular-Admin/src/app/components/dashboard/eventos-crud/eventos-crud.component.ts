import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventoService, Evento } from '../../../services/evento.service';

@Component({
  selector: 'app-eventos-crud',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './eventos-crud.component.html',
  styleUrl: './eventos-crud.component.scss'
})
export class EventosCrudComponent {
  private readonly eventoService = inject(EventoService);
  
  eventos = signal<Evento[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    afterNextRender(() => {
      this.loadEventos();
    });
  }

  loadEventos() {
    this.isLoading.set(true);
    this.eventoService.getEventos().subscribe({
      next: (data) => {
        this.eventos.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los eventos');
        this.isLoading.set(false);
      }
    });
  }

  deleteEvento(id: number) {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      this.eventoService.deleteEvento(id).subscribe({
        next: () => this.loadEventos(),
        error: () => alert('Error al eliminar')
      });
    }
  }
}
