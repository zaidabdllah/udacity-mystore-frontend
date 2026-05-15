import { Component, signal } from '@angular/core';
import { Toast } from './services/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('udacity-mystore-frontend');

  constructor(public toast: Toast) {}
}
