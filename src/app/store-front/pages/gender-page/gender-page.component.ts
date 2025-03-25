import { I18nSelectPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/services/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [I18nSelectPipe, ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);
  paginationService = inject(PaginationService);
  gender = toSignal(
    this.activatedRoute.params.pipe(map(({ gender }) => gender))
  );

  genderMap = {
    men: 'Hombre',
    woman: 'Mujer',
    kid: 'Niño',
  };

  productsGenderResource = rxResource({
    request: () => ({
      gender: this.gender(),
      page: this.paginationService.getCurrentPage - 1,
    }),
    loader: ({ request }) =>
      this.productService.getProducts({
        offset: request.page * 9,
        gender: request.gender,
      }),
  });
}
