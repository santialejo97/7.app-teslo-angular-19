import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnChanges,
  SimpleChanges,
  viewChild,
} from '@angular/core';
// import Swiper JS
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-swiper',
  imports: [ProductImagePipe],
  templateUrl: './product-swiper.component.html',
  styleUrl: './product-swiper.component.css',
})
export class ProductSwiperComponent implements AfterViewInit, OnChanges {
  images = input.required<string[]>();
  elementDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper: Swiper | undefined = undefined;

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) return;
    if (!this.swiper) return;
    this.swiper.destroy(true, true);
    const paginationEl =
      this.elementDiv().nativeElement?.querySelector('.swiper-pagination');
    console.log(paginationEl);
    paginationEl.innerHTML = '';
    setTimeout(() => {
      this.swiperInit();
    }, 100);
  }

  swiperInit() {
    const element = this.elementDiv().nativeElement;
    if (!element) return;

    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules: [Navigation, Pagination],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
