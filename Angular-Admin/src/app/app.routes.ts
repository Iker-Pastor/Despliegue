import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: 'usuarios', loadComponent: () => import('./components/dashboard/usuarios-crud/usuarios-crud.component').then(m => m.UsuariosCrudComponent) },
      { path: 'eventos', loadComponent: () => import('./components/dashboard/eventos-crud/eventos-crud.component').then(m => m.EventosCrudComponent) },
      { path: 'noticias', loadComponent: () => import('./components/dashboard/noticias-crud/noticias-crud.component').then(m => m.NoticiasCrudComponent) },
      { path: 'estadisticas', loadComponent: () => import('./components/dashboard/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent) },
      { path: 'organizaciones', loadComponent: () => import('./components/dashboard/organizaciones-crud/organizaciones-crud.component').then(m => m.OrganizacionesCrudComponent) },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
    ]
  },
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  }
];
