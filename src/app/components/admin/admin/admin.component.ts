import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MatButtonModule, MatIcon],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  graficBtn: string = '';
  queryBtn: string = '';

  constructor(private router: Router) {
    //ver la url actual
    this.graficBtn = this.router.url === '/admin/graficas' ? 'primary' : '';
    this.queryBtn = this.router.url === '/admin/consultas' ? 'primary' : '';
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        if (event.url === '/admin/graficas') {
          this.graficBtn = 'primary';
          this.queryBtn = '';
        } else if (event.url === '/admin/consultas') {
          this.graficBtn = '';
          this.queryBtn = 'primary';
        }
      }
    });
  }
}
