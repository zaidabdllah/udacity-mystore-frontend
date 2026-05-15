import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartServices } from '../../services/cart';

@Component({
  selector: 'app-success',
  standalone: false,
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success {
  constructor(public cartServices: CartServices, private router: Router) { }

  backToProducts(): void {
    this.cartServices.clearCheckoutSuccess();
    this.router.navigate(['/']);
  }
}
