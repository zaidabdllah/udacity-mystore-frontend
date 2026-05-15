import { Component, Input } from '@angular/core';
import { ProductShape } from '../../services/product';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: ProductShape;

  constructor(private toast: Toast) {}

  onQuantityChanged(quantity: number): void {
    const message = quantity ? `${this.product.name} quantity: ${quantity}` : `${this.product.name} removed`;
    this.toast.show(message);
  }
}
