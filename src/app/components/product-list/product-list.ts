import { Component, OnInit, signal } from '@angular/core';
import { ProductShape, Product } from '../../services/product';
import { Toast } from '../../services/toast';
import type { ProductQuantityChange } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: ProductShape[] = [];
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private productService: Product, private toast: Toast) {}

  ngOnInit(): void {
    this.isLoading.set(true)

    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products;
        this.isLoading.set(false)
      },
      error: () => {
        this.errorMessage.set('Failed to load products');
        this.isLoading.set(false)
      }
    });
  }

  onQuantityChanged(change: ProductQuantityChange): void {
    const message = change.quantity
      ? `${change.product.name} quantity: ${change.quantity}`
      : `${change.product.name} removed`;

    this.toast.show(message);
  }
}
