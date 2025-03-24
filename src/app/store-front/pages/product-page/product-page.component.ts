import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductSwiperComponent } from '../../../products/components/product-swiper/product-swiper.component';

@Component({
  selector: 'app-product-page',
  imports: [ProductSwiperComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productIdSlug: string = inject(ActivatedRoute).snapshot.params['id'];
  productService = inject(ProductsService);

  productResource = rxResource({
    request: () => ({
      id: this.productIdSlug,
    }),
    loader: ({ request }) => {
      return this.productService.getProductByIdSlug(request.id);
    },
  });
}
