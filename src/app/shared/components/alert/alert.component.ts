import {
  Component,
  computed,
  input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';

export type Alerts = 'error' | 'success' | 'info';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
})
export class AlertComponent implements OnChanges {
  description = input.required<string>();
  typeAlert = input.required<Alerts>();
  showAlert = signal<boolean>(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.showAlert() && this.description() != '') {
      this.showAlert.set(true);
      setTimeout(() => {
        this.showAlert.set(false);
      }, 3000);
    }
  }
}
