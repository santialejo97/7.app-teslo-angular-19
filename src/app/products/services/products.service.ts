import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  Product,
  ProductResponse,
} from '@products/interfaces/product.interfaces';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getProducts(options: Options): Observable<ProductResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    return this.http
      .get<ProductResponse>(`${this.baseUrl}/products`, {
        params: { limit, offset, gender },
      })
      .pipe(tap((resp) => console.log(resp)));
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${idSlug}`);
  }
}
