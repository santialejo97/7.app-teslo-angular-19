import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormUserComponent } from '@users/components/form-user/form-user.component';
import { UsersService } from '@users/services/users.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-admin-page',
  imports: [FormUserComponent],
  templateUrl: './user-admin-page.component.html',
})
export class UserAdminPageComponent {
  id = input.required<string>();
  usersService = inject(UsersService);

  userResource = rxResource({
    request: () => ({ id: this.id() }),
    loader: ({ request }) => {
      console.log(request.id);
      return of(request.id);
    },
  });
}
