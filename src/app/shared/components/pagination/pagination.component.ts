import {
  Component,
  computed,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shared-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  currentPage = input<number>(1);
  pages = input<number>(0);
  activePage = linkedSignal(() => this.currentPage());

  getPages = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });
}
