import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtil } from '@shared/utils/form-util';
import { JsonPipe } from '@angular/common';
import { AuthService } from '@auth/services/auth.service';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { Observer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, AlertComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  formUtils = FormUtil;
  router = inject(Router);
  authService = inject(AuthService);

  hasError = signal(false);
  descriptionError = signal<string>('');

  loginForm: FormGroup = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.pattern(this.formUtils.emailPattern)],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        // Validators.pattern(this.formUtils.passwordPattern)
      ],
    ],
  });

  observer: Observer<boolean> = {
    next: (isAuth) => {
      if (isAuth) {
        this.router.navigateByUrl('/');
        return;
      }
    },
    error: (err: HttpErrorResponse) => {
      this.descriptionError.set(err.error.message);
      this.hasError.set(true);
      this.clearAlerts();
    },
    complete: () => {},
  };

  onSubmit() {
    if (!this.loginForm.valid) {
      this.hasError.set(true);
      this.clearAlerts();
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe(this.observer);
  }

  clearAlerts() {
    setTimeout(() => {
      this.hasError.set(false);
    }, 2000);
  }
}
