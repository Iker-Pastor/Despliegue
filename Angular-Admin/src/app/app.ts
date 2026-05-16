import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertModalComponent } from './components/shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('BlueCrew Admin');
}
