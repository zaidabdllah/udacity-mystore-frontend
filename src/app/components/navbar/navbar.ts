import { Component, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthModal } from '../auth-modal/auth-modal'
import { Auth, AuthUser } from '../../services/auth';
import { Router } from '@angular/router';
import { CartServices } from '../../services/cart';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {

  constructor(private modalService: NgbModal,
    private auth: Auth,
    private router: Router,
    public cart: CartServices) { }


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
    this.router.navigate(['/']);
    this.cart.clearCartState();
    this.auth.logout();
  }

  onCartClick(): void {
    if (!this.currentUser()) {
      this.openAuthModal();
      return;
    }

    this.router.navigate(['/cart']);
  }

}
