import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase/auth.service';
import { CommonModule } from '@angular/common';
import { UsersFbService } from '../../../services/firebase/users-fb.service';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { QrdataService } from '../../../services/qr/qrdata.service';
import { QrComponent } from '../../qr/qr.component';

@Component({
  selector: 'app-nav-user-state',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIcon, QrComponent],
  templateUrl: './nav-user-state.component.html',
  styleUrl: './nav-user-state.component.css',
})
export class NavUserStateComponent {
  datosUsuario: any;
  isQrVisible: boolean = false;

  private userStateSubscription?: Subscription;
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
    private qrService: QrdataService
  ) {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  ngOnInit() {
    this.userStateSubscription = this.authService
      .getCurrentUserState()
      .subscribe(({ user, isAdmin }) => {
        if (user) {
          this.userLogged = true;
          this.displayName = user.displayName || '';
          this.admin = isAdmin;
          console.log('userUid', user.uid);
          this.qrService
            .getData(user.uid)
            .then((data) => {
              this.datosUsuario = data;
              console.log('datosUsuario', this.datosUsuario);
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
        } else {
          this.userLogged = false;
          this.admin = false;
          this.displayName = '';
        }
      });
  }

  ngOnDestroy() {
    if (this.userStateSubscription) {
      this.userStateSubscription.unsubscribe();
    }
  }

  handleResize = () => {
    if (window.innerWidth >= this.bs_lg) {
      this.dropstart = true;
    } else {
      this.dropstart = false;
    }
  };

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
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  toggleQR() {
    this.isQrVisible = !this.isQrVisible;
    console.log(this.datosUsuario);
  }
}
