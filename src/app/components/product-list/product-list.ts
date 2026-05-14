import { Component, OnInit, signal } from '@angular/core';
import { ProductShape, Product } from '../../services/product';

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

  constructor(private productService: Product) {}

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
}