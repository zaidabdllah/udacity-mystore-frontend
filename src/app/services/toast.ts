import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  text: string;
  type: 'success' | 'danger';
}

@Injectable({
  providedIn: 'root',
})
export class Toast {
  message = signal<ToastMessage | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  show(text: string, type: 'success' | 'danger' = 'success'): void {
    this.message.set({ text, type });
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.message.set(null);
    }, 2000);
  }

  hide(): void {
    clearTimeout(this.timer);
    this.message.set(null);
  }
}
