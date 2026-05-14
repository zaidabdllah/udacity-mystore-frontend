import { Component, Input } from '@angular/core';
import { ProductShape } from '../../services/product';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: ProductShape;
}
