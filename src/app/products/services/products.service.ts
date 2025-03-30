import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/auth.interfaces';
import {
  Gender,
  type Product,
  type ProductResponse,
} from '@products/interfaces/product.interfaces';
import { delay, Observable, of, tap, map, forkJoin, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  private productsCache = new Map<string, ProductResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductResponse>(`${this.baseUrl}/products`, {
        params: { limit, offset, gender },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }
    return this.http.get<Product>(`${this.baseUrl}/products/${idSlug}`).pipe(
      tap((product) => console.log(product)),
      tap((product) => this.productCache.set(idSlug, product))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id == 'new') {
      return of(emptyProduct);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
      tap((product) => console.log(product)),
      tap((product) => this.productCache.set(id, product))
    );
  }

  updateProduct(
    product: Partial<Product>,
    id: string,
    fileList?: FileList
  ): Observable<Product> {
    const currentImage = product.images ? [...product.images] : [];
    return this.uploadImages(fileList).pipe(
      map((imageNames) => ({
        ...product,
        images: [...currentImage, ...imageNames],
      })),
      switchMap((updatedProduct) =>
        this.http.patch<Product>(
          `${this.baseUrl}/products/${id}`,
          updatedProduct
        )
      ),
      tap((product) => this.updateProductCache(product))
    );
  }

  updateProductCache(product: Product, newProduct: boolean = false) {
    const productId = product.id;
    this.productCache.set(productId, product);

    if (!newProduct) return;

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) =>
          currentProduct.id == productId ? product : currentProduct
      );
    });
  }

  createProduct(
    product: Partial<Product>,
    fileList?: FileList
  ): Observable<Product> {
    const currentImage = product.images ? [...product.images] : [];

    return this.uploadImages(fileList).pipe(
      map((imageName) => ({
        ...product,
        images: [...currentImage, ...imageName],
      })),
      switchMap((productLike) =>
        this.http.post<Product>(`${this.baseUrl}/products`, product)
      ),
      tap((product) => this.updateProductCache(product, true))
    );
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables);
  }

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);

    return this.http
      .post<{ fileName: string }>(`${this.baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}
