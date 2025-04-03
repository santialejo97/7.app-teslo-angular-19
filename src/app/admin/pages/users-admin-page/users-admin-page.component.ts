import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserListComponent } from '@users/components/user-list/user-list.component';
import { UsersService } from '@users/services/users.service';

@Component({
  selector: 'app-users-admin-page',
  imports: [UserListComponent],
  templateUrl: './users-admin-page.component.html',
})
export class UsersAdminPageComponent {
  userService = inject(UsersService);

  usersResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.userService.getAllUsers({});
    },
  });
}
