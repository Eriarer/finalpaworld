import { Component } from '@angular/core';
import { NavSerachComponent } from '../nav-serach/nav-serach.component';
import { NavUserStateComponent } from '../nav-user-state/nav-user-state.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterModule,
    NavSerachComponent,
    NavUserStateComponent,
    CommonModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  private userStateSubscription?: Subscription;
  userLogged = false;
  appName = 'PaWorld';
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.userStateSubscription = this.authService
      .getCurrentUserState()
      .subscribe(({ user, isAdmin }) => {
        if (user) {
          this.userLogged = true;
        } else {
          this.userLogged = false;
        }
      });
  }

  ngOnDestroy() {
    if (this.userStateSubscription) {
      this.userStateSubscription.unsubscribe();
    }
  }
}
