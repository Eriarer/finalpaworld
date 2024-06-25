import { User } from '@angular/fire/auth';
export interface UserState {
  user: User | null;
  isAdmin: boolean;
}
