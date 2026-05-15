import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { CartServices } from '../services/cart';

@Injectable({
  providedIn: 'root',
})
export class SuccessGuard implements CanActivate {
  constructor(private cartServices: CartServices, private router: Router) { }

  canActivate(): boolean | UrlTree {
    if (this.cartServices.checkoutSuccess()) {
      return true;
    }

    return this.router.createUrlTree(['/cart']);
  }
}
