import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase/auth.service';
import { CommonModule } from '@angular/common';
import { UsersFbService } from '../../../services/firebase/users-fb.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-nav-user-state',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIcon],
  templateUrl: './nav-user-state.component.html',
  styleUrl: './nav-user-state.component.css',
})
export class NavUserStateComponent {
  userLogged: boolean = true;
  admin: boolean = false;
  displayName: string = '';
  // bt breakpoints
  bs_sm: number = 576;
  bs_md: number = 768;
  bs_lg: number = 992;
  bs_xl: number = 1200;

  dropstart: boolean = false;

  adminRoute: boolean = false;
  // crear un listener para el tamaño de la pantalla
  // y cambiar el valor de dropstart
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UsersFbService
  ) {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        console.log('User is signed in', user);
        console.log('UserID', user.uid);
        console.log('UserEmail', user.email);
        console.log('UserPhone', user.phoneNumber);
        console.log('UserDisplayName', user.displayName);
        this.userLogged = true;
        this.displayName = user.displayName!;
        this.userService.isUserAdmin(user.uid).then((isAdmin) => {
          this.admin = isAdmin;
        });
      } else {
        console.log('No user signed in');
        this.userLogged = false;
        this.admin = false;
        this.displayName = '';
      }
    });
  }

  handleResize = () => {
    if (window.innerWidth >= this.bs_lg) {
      this.dropstart = true;
    } else {
      this.dropstart = false;
    }
  };

  ngOnInit() {
    this.isAdmin();
  }

  isAdmin() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('admin')) {
          this.adminRoute = true;
        } else {
          this.adminRoute = false;
        }
      }
    });
  }

  logout() {
    this.router.navigate(['/inicio']);
    this.authService.signOut();
    window.location.reload();
  }
}
