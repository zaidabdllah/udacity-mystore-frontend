import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Observable } from 'rxjs';
import { AuthModal } from '../auth-modal/auth-modal';
import { Auth } from '../../services/auth';
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

  constructor(
    private cartServices: CartServices,
    private auth: Auth,
    private modalService: NgbModal
  ) {}

  get quantity(): number {
    return this.product ? this.cartServices.getProductQuantity(this.product.id) : 0;
  }

  addOne(): void {
    if (this.shouldOpenAuthModal()) return;

    const request = this.quantity
      ? this.cartServices.editCartItem(this.product, this.quantity + 1)
      : this.cartServices.addtoCart(this.product, 1);

    this.updateCart(request, this.quantity + 1);
  }

  removeOne(): void {
    if (this.shouldOpenAuthModal()) return;

    const request = this.quantity <= 1
      ? this.cartServices.deleteCartItem(this.product)
      : this.cartServices.editCartItem(this.product, this.quantity - 1);

    this.updateCart(request, Math.max(this.quantity - 1, 0));
  }

  setQuantity(quantity: number): void {
    if (this.shouldOpenAuthModal()) return;
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

  private shouldOpenAuthModal(): boolean {
    if (this.auth.currentUser()) return false;

    this.modalService.open(AuthModal, {
      centered: true,
      size: 'md'
    });

    return true;
  }
}
