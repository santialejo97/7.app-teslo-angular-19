import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtil } from '../../../shared/utils/form-util';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { JsonPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, AlertComponent, RouterLink],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  formUtils = FormUtil;
  authService = inject(AuthService);
  router = inject(Router);
  hasError = signal(false);

  formRegister: FormGroup = this.formBuilder.group(
    {
      email: [
        '',
        [Validators.required, Validators.pattern(this.formUtils.emailPattern)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          // TODO Solucionar validacion de expresion regular
          // Validators.pattern(this.formUtils.passwordPattern)
        ],
      ],
      fullName: [
        '',
        [Validators.required, Validators.pattern(this.formUtils.namePattern)],
      ],
      password2: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          // TODO Solucionar validacion de expresion regular
          // Validators.pattern(this.formUtils.passwordPattern)
        ],
      ],
    },
    {
      validators: [
        this.formUtils.isFieldOneEqualFieldTwo('password', 'password2'),
      ],
    }
  );

  onSubmit() {
    if (!this.formRegister.valid) {
      this.hasError.set(true);
      this.clearAlerts();
      return;
    }

    const { email, password, fullName } = this.formRegister.value;

    this.authService
      .register({ email, password, fullName })
      .subscribe((isRegister) => {
        if (isRegister) {
          this.router.navigateByUrl('/');
          return;
        }
        this.hasError.set(true);
        this.clearAlerts();
      });
  }

  clearAlerts() {
    setTimeout(() => {
      this.hasError.set(false);
    }, 2000);
  }
}
