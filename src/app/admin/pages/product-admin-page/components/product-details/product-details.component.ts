import { Component, inject, input, OnInit, signal } from '@angular/core';
import type { Product } from '@products/interfaces/product.interfaces';
import { ProductSwiperComponent } from '@products/components/product-swiper/product-swiper.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtil } from '@shared/utils/form-util';
import { firstValueFrom, map } from 'rxjs';
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import {
  AlertComponent,
  Alerts,
} from '@shared/components/alert/alert.component';

@Component({
  selector: 'product-details',
  imports: [ProductSwiperComponent, ReactiveFormsModule, AlertComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();
  productService = inject(ProductsService);
  router = inject(Router);
  formUtils = FormUtil;
  formBuilder: FormBuilder = inject(FormBuilder);

  sizes = ['XS', 'S', 'M', 'XL', 'L', 'XXL'];

  formNewProduct: FormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(this.formUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  messageAlert = signal<string>('');
  typeAlert = signal<Alerts>('success');
  hasSuccess = signal(false);

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.formNewProduct.patchValue(formLike);
    this.formNewProduct.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeClicked(size: string) {
    const currentSize = (this.formNewProduct.value.sizes as string[]) ?? [];
    if (currentSize.includes(size)) {
      currentSize.splice(currentSize.indexOf(size), 1);
    } else {
      currentSize.push(size);
    }

    this.formNewProduct.patchValue({
      sizes: currentSize,
    });
  }

  async onSubmit() {
    this.formNewProduct.markAllAsTouched();

    const isVAlid = this.formNewProduct.valid;
    if (!isVAlid) return;

    const formValue = this.formNewProduct.value;

    const productLike: Partial<Product> = {
      ...formValue,
      tags:
        formValue.tags
          .toLowerCase()
          .split(',')
          .map((value: string) => value.trim()) ?? [],
    };
    if (this.product().id == 'new') {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike)
      );
      this.router.navigate(['/admin/product', product.id]);
      this.messageAlert.set('Producto Creado correctamente');
      this.hasSuccess.set(true);
      this.clearAlert();
    } else {
      await firstValueFrom(
        this.productService.updateProduct(productLike, this.product().id)
      );
      this.messageAlert.set('Producto actualizado correctamente');
      this.hasSuccess.set(true);
      this.clearAlert();
    }
  }

  clearAlert() {
    setTimeout(() => {
      this.hasSuccess.set(false);
    }, 2000);
  }
}
