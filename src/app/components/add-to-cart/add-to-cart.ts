import { Component, EventEmitter, Input, Output } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { CartItemResponse, CartServices } from '../../services/cart';
import { ProductShape } from '../../services/product';

@Component({
  selector: 'app-add-to-cart',
  standalone: false,
  templateUrl: './add-to-cart.html',
  styleUrl: './add-to-cart.css',
})
export class AddToCart {
  @Input() product!: ProductShape;
  @Output() quantityChanged = new EventEmitter<number>();

  isSaving = false;
  isAnimating = false;
  quantityOptions = Array.from({ length: 20 }, (_, index) => index + 1);

  constructor(private cartServices: CartServices) {}

  get quantity(): number {
    return this.product ? this.cartServices.getProductQuantity(this.product.id) : 0;
  }

  addOne(): void {
    const request = this.quantity
      ? this.cartServices.editCartItem(this.product, this.quantity + 1)
      : this.cartServices.addtoCart(this.product, 1);

    this.updateCart(request, this.quantity + 1);
  }

  removeOne(): void {
    const request = this.quantity <= 1
      ? this.cartServices.deleteCartItem(this.product)
      : this.cartServices.editCartItem(this.product, this.quantity - 1);

    this.updateCart(request, Math.max(this.quantity - 1, 0));
  }

  setQuantity(quantity: number): void {
    if (quantity === this.quantity) return;
    this.updateCart(this.cartServices.editCartItem(this.product, quantity), quantity);
  }

  private updateCart(request: Observable<CartItemResponse>, quantity: number): void {
    if (this.isSaving || !this.product) return;

    this.isSaving = true;

    request.pipe(finalize(() => this.isSaving = false)).subscribe({
      next: () => {
        this.animateQuantity();
        this.quantityChanged.emit(quantity);
      },
      error: (error) => console.error('Cart update failed:', error)
    });
  }

  private animateQuantity(): void {
    this.isAnimating = false;

    setTimeout(() => {
      this.isAnimating = true;
    });
  }
}
