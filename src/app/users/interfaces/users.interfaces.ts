import { User } from '@auth/interfaces/auth.interfaces';

export interface UsersResponse {
  count: number;
  pages: null;
  users: User[];
}
