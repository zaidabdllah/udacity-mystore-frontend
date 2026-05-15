import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { Auth, LoginPayload, RegisterPayload } from '../../services/auth'
import { CartServices } from '../../services/cart';

@Component({
  selector: 'app-auth-modal',
  standalone: false,
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css',
})
export class AuthModal {
  loginError = signal<string | null>(null);
  isLoggingIn = signal(false);
  registerError = signal<string | null>(null);
  isRegistering = signal(false);

  constructor(public activeModal: NgbActiveModal, public authModal: Auth, private cartServices: CartServices) {}

  onLogin(data: LoginPayload): void {
    this.loginError.set(null);
    this.isLoggingIn.set(true);

    this.authModal.login(data)
      .pipe(finalize(() => this.isLoggingIn.set(false)))
      .subscribe({
        next: (response) => {
          this.authModal.saveSession(response);
          this.cartServices.loadCart();
          this.activeModal.close();
        },
        error: (error: HttpErrorResponse) => {
          this.loginError.set(error.error?.error ?? 'Invalid username or password.');
        }
      });
  }

  clearLoginError(): void {
    this.loginError.set(null);
  }

  clearRegisterError(): void {
    this.registerError.set(null);
  }

  onRegister(data: RegisterPayload): void {
    this.registerError.set(null);

    if (data.password !== data.repassword) {
      this.registerError.set('Passwords do not match.');
      return;
    }

    this.isRegistering.set(true);

    this.authModal.register(data)
      .pipe(finalize(() => this.isRegistering.set(false)))
      .subscribe({
        next: (response) => {
          this.authModal.saveSession(response);
          this.cartServices.loadCart();
          this.activeModal.close();
        },
        error: (error: HttpErrorResponse) => {
          this.registerError.set(error.error?.error ?? 'Unable to create account. Please try again.');
        }
      });
  }

}
