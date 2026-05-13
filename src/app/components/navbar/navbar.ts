import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthModal } from '../auth-modal/auth-modal'
import { Auth, AuthUser } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {

constructor(private modalService: NgbModal, public auth: Auth) {}

currentUser(): AuthUser | null {
  return this.auth.currentUser();
}

  openAuthModal(): void {
    this.modalService.open(AuthModal, {
      centered: true,
      size: 'md'
    });
  }

  logout(): void {
    this.auth.logout();
  }

}
