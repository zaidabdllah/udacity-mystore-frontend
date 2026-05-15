import { Component, OnInit, signal } from '@angular/core';
import { Product, ProductShape, ProductResponse } from '../../services/product';
import { ActivatedRoute } from '@angular/router';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})

export class ProductDetails implements OnInit {
  product?: ProductShape;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

constructor(private route: ActivatedRoute, private productService: Product, private toast: Toast) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.isLoading.set(true);

    this.productService.getProductById(id).subscribe({
      next: (response: ProductResponse) => {
        this.product = response.product;
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Product not found');
        this.isLoading.set(false);
      }
    });
  }

  onQuantityChanged(quantity: number): void {
    const message = quantity ? `${this.product?.name} quantity: ${quantity}` : `${this.product?.name} removed`;
    this.toast.show(message);
  }

}
