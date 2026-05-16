import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductShape } from '../../services/product';

export interface ProductQuantityChange {
  product: ProductShape;
  quantity: number;
}

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: ProductShape;
  @Output() quantityChanged = new EventEmitter<ProductQuantityChange>();

  onQuantityChanged(quantity: number): void {
    this.quantityChanged.emit({
      product: this.product,
      quantity
    });
  }
}
