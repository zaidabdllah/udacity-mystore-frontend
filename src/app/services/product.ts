import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductShape {
  id: number;
  name: string;
  price: string;
  category: string | null;
  thumbnail: string | null;
  description: string | null;
}

export interface ProductsResponse {
  ok: boolean;
  code: string;
  products: ProductShape[];
}

export interface ProductResponse {
  ok: boolean;
  code: string;
  product: ProductShape;
}



@Injectable({
  providedIn: 'root',
})


export class Product {
  private apiUrl = `${environment.Backend_apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.apiUrl);
  }
  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }
}
