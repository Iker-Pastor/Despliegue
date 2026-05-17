import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly router = inject(Router);
  isMenuCollapsed = signal<boolean>(true);

  toggleMenu() {
    this.isMenuCollapsed.update(val => !val);
  }

  closeMenu() {
    this.isMenuCollapsed.set(true);
  }

  logout() {
    this.closeMenu();
    // Aquí podrías llamar a AuthService.logout() si existiera
    this.router.navigate(['/login']);
  }
}
