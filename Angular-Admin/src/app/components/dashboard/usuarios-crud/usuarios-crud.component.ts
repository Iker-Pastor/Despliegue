import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, Usuario } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuarios-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios-crud.component.html',
  styleUrl: './usuarios-crud.component.scss'
})
export class UsuariosCrudComponent {
  private readonly usuarioService = inject(UsuarioService);
  private readonly fb = inject(FormBuilder);
  
  usuarios = signal<Usuario[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Control de Modal
  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  selectedUsuarioId = signal<number | null>(null);
  userForm: FormGroup;
  selectedFile: File | null = null;

  constructor() {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['USER', [Validators.required]],
      password_hash: [''],
      activo: [true]
    });

    afterNextRender(() => {
      this.loadUsuarios();
    });
  }

  loadUsuarios() {
    this.isLoading.set(true);
    this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.error.set('Error al cargar los usuarios');
        this.isLoading.set(false);
      }
    });
  }

  deleteUsuario(user: Usuario) {
    if (user.rol === 'ADMIN') {
      alert('No se pueden eliminar administradores');
      return;
    }

    if (confirm(`¿Estás seguro de desactivar al usuario ${user.nombre}?`)) {
      const updatedUser = { ...user, activo: false };
      this.usuarioService.updateUsuario(user.id, updatedUser).subscribe({
        next: () => {
          alert('Usuario desactivado con éxito');
          this.loadUsuarios();
        },
        error: (err: any) => {
          console.error(err);
          alert('Error al desactivar usuario');
        }
      });
    }
  }

  openAddModal() {
    this.isEditing.set(false);
    this.selectedUsuarioId.set(null);
    this.userForm.reset({ rol: 'USER', activo: true });
    this.userForm.get('password_hash')?.setValidators([Validators.required]);
    this.showModal.set(true);
  }

  openEditModal(usuario: Usuario) {
    this.isEditing.set(true);
    this.selectedUsuarioId.set(usuario.id);
    this.userForm.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      password_hash: '' // No mostramos el hash
    });
    this.userForm.get('password_hash')?.clearValidators();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveUsuario() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;
    const obs = this.isEditing() 
      ? this.usuarioService.updateUsuario(this.selectedUsuarioId()!, userData, this.selectedFile || undefined)
      : this.usuarioService.createUsuario(userData, this.selectedFile || undefined);

    obs.subscribe({
      next: () => {
        this.loadUsuarios();
        this.closeModal();
      },
      error: (err: any) => alert(err.error?.error || 'Error al guardar usuario')
    });
  }
}
