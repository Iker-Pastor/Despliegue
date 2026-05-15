import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NoticiaService, Noticia } from '../../../services/noticia.service';

@Component({
  selector: 'app-noticias-crud',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './noticias-crud.component.html',
  styleUrl: './noticias-crud.component.scss'
})
export class NoticiasCrudComponent {
  private readonly noticiaService = inject(NoticiaService);
  
  noticias = signal<Noticia[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    afterNextRender(() => {
      this.loadNoticias();
    });
  }

  loadNoticias() {
    this.isLoading.set(true);
    this.noticiaService.getNoticias().subscribe({
      next: (data) => {
        this.noticias.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las noticias');
        this.isLoading.set(false);
      }
    });
  }

  deleteNoticia(id: number) {
    if (confirm('¿Estás seguro de eliminar esta noticia?')) {
      this.noticiaService.deleteNoticia(id).subscribe({
        next: () => this.loadNoticias(),
        error: () => alert('Error al eliminar')
      });
    }
  }
}
