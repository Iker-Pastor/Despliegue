import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoticiaService, Noticia } from '../../../services/noticia.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-noticias-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './noticias-crud.component.html',
  styleUrl: './noticias-crud.component.scss'
})
export class NoticiasCrudComponent {
  private readonly noticiaService = inject(NoticiaService);
  private readonly alertService = inject(AlertService);
  private readonly fb = inject(FormBuilder);
  
  noticias = signal<Noticia[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Modal Control
  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  selectedNoticia: Noticia | null = null;
  noticiaForm: FormGroup;

  constructor() {
    this.noticiaForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      estadoAprobacionNoticia: ['PENDIENTE', [Validators.required]],
      estadoVisibilidad: [true, [Validators.required]],
      citaDestacada: ['']
    });

    afterNextRender(() => {
      this.loadNoticias();
    });
  }

  loadNoticias() {
    this.isLoading.set(true);
    this.noticiaService.getNoticias().subscribe({
      next: (data: any) => {
        this.noticias.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.error.set('Error al cargar las noticias');
        this.isLoading.set(false);
      }
    });
  }

  deleteNoticia(id: number) {
    this.alertService.confirm('Eliminar noticia', '¿Estás seguro de eliminar esta noticia?').then(confirmed => {
      if (confirmed) {
        this.noticiaService.deleteNoticia(id).subscribe({
          next: () => {
            this.loadNoticias();
            this.alertService.success('Eliminado', 'Noticia eliminada correctamente');
          },
          error: (err: any) => {
            console.error(err);
            const msg = err.error?.error || err.error?.message || 'Error al eliminar noticia.';
            this.alertService.error('Error', msg);
          }
        });
      }
    });
  }

  openAddModal() {
    this.isEditing.set(false);
    this.selectedNoticia = null;
    this.noticiaForm.reset({ 
      estadoAprobacionNoticia: 'PENDIENTE', 
      estadoVisibilidad: true 
    });
    this.showModal.set(true);
  }

  openEditModal(noticia: Noticia) {
    this.isEditing.set(true);
    this.selectedNoticia = noticia;
    this.noticiaForm.patchValue({
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      imagen: noticia.imagen,
      estadoAprobacionNoticia: noticia.estadoAprobacionNoticia,
      estadoVisibilidad: noticia.estadoVisibilidad,
      citaDestacada: noticia.citaDestacada || ''
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveNoticia() {
    if (this.noticiaForm.invalid) return;

    const noticiaData = { 
      ...this.selectedNoticia, // Preservar autor, categoria, etc.
      ...this.noticiaForm.value
    };

    const obs = this.isEditing() 
      ? this.noticiaService.updateNoticia(noticiaData)
      : this.noticiaService.createNoticia(noticiaData);

    obs.subscribe({
      next: () => {
        this.loadNoticias();
        this.closeModal();
        this.alertService.success('Guardado', 'Noticia guardada correctamente');
      },
      error: (err: any) => {
        console.error(err);
        this.alertService.error('Error', err.error?.error || 'Error al guardar noticia. Verifica los campos obligatorios.');
      }
    });
  }
}
