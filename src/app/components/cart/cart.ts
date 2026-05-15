import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CartServices, OrderProduct } from '../../services/cart';
import { ProductShape } from '../../services/product';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart implements OnInit {
  checkoutData = {
    name: '',
    address: '',
    cardnumber: '',
  };
  isCheckingOut = false;
  deletingProductId: number | null = null;

  constructor(public cartServices: CartServices, private toast: Toast, private router: Router) { }

  ngOnInit(): void {
    this.cartServices.loadCart();
  }

  getProduct(item: OrderProduct): ProductShape {
    return {
      id: item.product_id,
      name: item.name ?? 'Product',
      price: String(item.price ?? 0),
      category: item.category ?? null,
      thumbnail: item.thumbnail ?? null,
      description: item.description ?? null,
    };
  }
  
  onlyNumbers(event: KeyboardEvent): void {
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  getItemTotal(item: OrderProduct): number {
    return Number(item.price ?? 0) * Number(item.quantity ?? 0);
  }

  onQuantityChanged(item: OrderProduct, quantity: number): void {
    const name = item.name ?? 'Product';
    const message = quantity ? `${name} quantity: ${quantity}` : `${name} removed`;
    this.toast.show(message);
  }

  removeItem(item: OrderProduct): void {
    const product = this.getProduct(item);
    this.deletingProductId = item.product_id;

    this.cartServices.deleteCartItem(product)
      .pipe(finalize(() => this.deletingProductId = null))
      .subscribe({
        next: () => this.toast.show(`${product.name} removed`),
        error: () => this.toast.show('Unable to remove product.', 'danger')
      });
  }

  checkout(form: NgForm): void {
    if (form.invalid || !this.cartServices.items().length) return;

    const name = this.checkoutData.name;
    const address = this.checkoutData.address;
    const total = this.cartServices.TotalPrice();
    const quantity = this.cartServices.TotalQuantity();

    this.isCheckingOut = true;

    this.cartServices.checkoutCart()
      .pipe(finalize(() => this.isCheckingOut = false))
      .subscribe({
        next: () => {
          this.cartServices.setCheckoutSuccess(name, address, total, quantity);
          form.resetForm();
          this.router.navigate(['/success']);
        },
        error: (e) => {
          this.toast.show('Checkout failed. Please try again.', 'danger')
        }
      });
  }
}
