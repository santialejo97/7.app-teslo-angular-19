import { Component, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { of } from 'rxjs';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  router = inject(Router);
  productService = inject(ProductsService);
  id = input.required<string>();

  productResource = rxResource({
    request: () => ({ id: this.id() }),
    loader: ({ request }) => {
      // if ((request.id = 'newProduct')) return of({});
      return this.productService.getProductById(request.id);
    },
  });

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigateByUrl('/admin/products');
    }
  });
}
