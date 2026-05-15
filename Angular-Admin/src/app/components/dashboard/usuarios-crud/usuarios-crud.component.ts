import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService, Usuario } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuarios-crud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-crud.component.html',
  styleUrl: './usuarios-crud.component.scss'
})
export class UsuariosCrudComponent {
  private readonly usuarioService = inject(UsuarioService);
  
  usuarios = signal<Usuario[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    afterNextRender(() => {
      this.loadUsuarios();
    });
  }

  loadUsuarios() {
    this.isLoading.set(true);
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los usuarios');
        this.isLoading.set(false);
      }
    });
  }

  deleteUsuario(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => this.loadUsuarios(),
        error: () => alert('Error al eliminar')
      });
    }
  }
}
