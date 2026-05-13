import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  ok: boolean;
  code: string;
  user: AuthUser;
  jwtToken: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  repassword?: string;
}

@Injectable({
  providedIn: 'root',
})

export class Auth {
  private apiUrl = `${environment.Backend_apiUrl}/users`;
  currentUser = signal<AuthUser | null>(this.getUser());

  constructor(private http: HttpClient) { }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload);
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload);
  }
  saveSession(response: AuthResponse): void {
    if (!this.hasStorage()) {
      return;
    }

    localStorage.setItem('token', response.jwtToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  getToken(): string | null {
    if (!this.hasStorage()) {
      return null;
    }

    return localStorage.getItem('token');
  }

  getUser(): AuthUser | null {
    if (!this.hasStorage()) {
      return null;
    }

    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    if (!this.hasStorage()) {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private hasStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

}
