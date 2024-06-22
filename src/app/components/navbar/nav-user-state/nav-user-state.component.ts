import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-user-state',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-user-state.component.html',
  styleUrl: './nav-user-state.component.css',
})
export class NavUserStateComponent {
  [x: string]: any;
  userLogged = true;
  // bt breakpoints
  bs_sm: number = 576;
  bs_md: number = 768;
  bs_lg: number = 992;
  bs_xl: number = 1200;

  dropstart: boolean = false;

  adminRoute: boolean = false;
  // crear un listener para el tamaño de la pantalla
  // y cambiar el valor de dropstart
  constructor(private router: Router) {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
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
}
