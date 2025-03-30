import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'ProductImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string[] | string | null): string {
    if (value === null) {
      return './assets/images/no-image.webp';
    }

    if (typeof value === 'string' && value.startsWith('blob')) {
      return value;
    }

    if (typeof value == 'string') {
      return `${baseUrl}/files/product/${value}`;
    }

    const image = value.at(0);

    if (!image) {
      return './assets/images/no-image.webp';
    }

    return `${baseUrl}/files/product/${value[0]}`;
  }
}
