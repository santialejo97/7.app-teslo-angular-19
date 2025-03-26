import { Component, input, OnInit, signal } from '@angular/core';

export type Alerts = 'error' | 'success' | 'info';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  description = input.required<string>();
  typeAlert = input.required<Alerts>();
}
