import { Component, inject, signal } from '@angular/core';
import { ProductsTableComponent } from '../../../products/components/products-table/products-table.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@shared/services/pagination.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Product } from '../../../products/interfaces/product.interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductsTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsPage = signal(20);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.getCurrentPage - 1,
      limit: this.productsPage(),
    }),
    loader: ({ request }) => {
      return this.productService.getProducts({
        offset: request.page * request.limit,
        limit: request.limit,
      });
    },
  });
}
