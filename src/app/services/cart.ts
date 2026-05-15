import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';
import { tap } from 'rxjs';
import { ProductShape } from './product';

export interface Order {
  id: number;
  user_id: number;
  status: 'active' | 'complete';
  total_price?: number;
  total_quantity?: number;
  items?: OrderProduct[];
};

export interface CartResponse {
  ok: boolean;
  code: string;
  order: Order;
}

export interface CartItemResponse {
  ok: boolean;
  code: string;
  productInOrder: OrderProduct;
}

export interface OrderProduct {
  id?: number;
  product_id: number;
  quantity?: number;
  price?: number | string;
  name?: string;
  category?: string | null;
  thumbnail?: string | null;
  description?: string | null;
};

@Injectable({
  providedIn: 'root',
})

export class CartServices {
  private apiUrl = `${environment.Backend_apiUrl}/orders`;
  cart = signal<Order | null>(null);
  items = computed(() => this.cart()?.items ?? []);
  TotalQuantity = computed(() => this.cart()?.total_quantity ?? 0);
  TotalPrice = computed(() => this.cart()?.total_price ?? 0);

  constructor(private http: HttpClient, private authService: Auth) {
    this.loadCart();
  }

  apigetCart(): Observable<CartResponse> {
    return this.http
      .get<CartResponse>(`${this.apiUrl}/current/${this.authService.currentUser()?.id}`, this.authService.getAuthHeaders())
      .pipe(
        tap((data) => {
          this.cart.set(data.order);
        })
      );
  }

  addtoCart(Product: ProductShape, Quantity: string | number): Observable<CartItemResponse> {
    const body = { product_id: Product.id, quantity: Quantity };
    return this.http.post<CartItemResponse>(`${this.apiUrl}/${this.cart()?.id}/product`, body, this.authService.getAuthHeaders()).pipe(
      tap(() => {
        this.cart.update((cart) => {
          if (!cart) return cart;
          const ifexistingItem = cart.items?.find(item => item.product_id === Product.id);
          if (ifexistingItem) {
            ifexistingItem.quantity = (ifexistingItem.quantity ?? 0) + Number(Quantity);
          } else {
            const newItem: OrderProduct = {
              product_id: Product.id,
              name: Product.name,
              price: Product.price,
              category: Product.category,
              thumbnail: Product.thumbnail,
              description: Product.description,
              quantity: Number(Quantity)
            };
            cart.items = [...(cart.items ?? []), newItem];
          }

          return {
            ...cart,
            total_quantity: this.calculateTotalQuantity(cart.items ?? []),
            total_price: this.calculateTotalPrice(cart.items ?? [])
          };
        });
      })
    );
  }

  editCartItem(Product: ProductShape, Quantity: string | number): Observable<CartItemResponse> {
    const body = { product_id: Product.id, quantity: Quantity };
    return this.http.patch<CartItemResponse>(`${this.apiUrl}/${this.cart()?.id}/product`, body, this.authService.getAuthHeaders()).pipe(
      tap(() => {
        this.cart.update((cart) => {
          if (!cart) return cart;

          const ifexistingItem = cart.items?.find(
            item => item.product_id === Product.id
          );

          if (ifexistingItem) {
            ifexistingItem.quantity = Number(Quantity);
          }

          return {
            ...cart,
            total_quantity: this.calculateTotalQuantity(cart.items ?? []),
            total_price: this.calculateTotalPrice(cart.items ?? [])
          };
        });
      })
    );
  }

  deleteCartItem(product: ProductShape): Observable<CartItemResponse> {
    const body = { product_id: product.id };

    return this.http.delete<CartItemResponse>(`${this.apiUrl}/${this.cart()?.id}/product`, { ...this.authService.getAuthHeaders(), body }).pipe(
      tap(() => {
        this.cart.update((cart) => {
          if (!cart) return cart;

          cart.items = (cart.items ?? []).filter(
            item => item.product_id !== product.id
          );

          return {
            ...cart,
            total_quantity: this.calculateTotalQuantity(cart.items),
            total_price: this.calculateTotalPrice(cart.items)
          };
        });
      })
    );
  }

  checkoutCart(): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.apiUrl}/${this.cart()?.id}/checkout`, {}, this.authService.getAuthHeaders()).pipe(
      tap(() => {
        this.clearCartState();
      })
    );
  }

  clearCartState(): void {
    this.cart.set(null);
  }

  loadCart(): void {
    const user = this.authService.currentUser();

    if (!user) {
      return;
    }

    this.apigetCart().subscribe({
      next: (data) => {
        this.cart.set(data.order);
      },
      error: () => {
        this.cart.set(null);
      }
    });
  }

  private calculateTotalQuantity(items: OrderProduct[]): number {
    return items.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
  }

  private calculateTotalPrice(items: OrderProduct[]): number {
    return Number(
      items.reduce((sum, item) => {
        const price = Number(item.price ?? 0);
        const quantity = Number(item.quantity ?? 0);

        return sum + price * quantity;
      }, 0).toFixed(2)
    );
  }

}
