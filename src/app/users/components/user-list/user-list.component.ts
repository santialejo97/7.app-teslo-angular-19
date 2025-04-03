import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@auth/interfaces/auth.interfaces';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import {
  AlertComponent,
  Alerts,
} from '@shared/components/alert/alert.component';
import { UserImagePipe } from '@users/pipes/user-image.pipe';
import { UsersService } from '@users/services/users.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [UserImagePipe, CommonModule, AlertComponent, RouterLink],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  userService = inject(UsersService);
  users = input.required<User[]>();
  showAlert = signal(false);
  typeAlert = signal<Alerts>('error');
  description = signal<string>('');

  observe: Observer<string> = {
    next: (value: string) => {
      this.showAlert.set(true);
      this.typeAlert.set('success');
      this.description.set(value);
    },
    error: (err: HttpErrorResponse) => {
      this.showAlert.set(true);
      this.description.set(err.error.message);
    },
    complete: () => {},
  };

  deleteUser(id: string) {
    this.userService.deleteLogicUserById(id).subscribe(this.observe);
  }
}
