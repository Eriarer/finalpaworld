import { Component, Input } from '@angular/core';
import { MascotasService } from '../../services/data/mascotas.service';
import { Mascota } from '../../interfaces/mascota';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-mascota',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, RouterModule, CommonModule],
  templateUrl: './mascota.component.html',
  styleUrl: './mascota.component.css',
})
export class MascotaComponent {
  //   path: 'mascotas/:id',
  ids?: string[];
  mascotas: Mascota[];

  constructor(public mascotasService: MascotasService, private router: Router) {
    // obtener el id de la mascota desde la URL
    if (this.router.url.split('/')[2]) {
      this.ids = this.router.url.split('/')[2].split('-');
      this.mascotas = this.mascotasService.getMascotasByIds(this.ids);
    } else {
      this.mascotas = this.mascotasService.getMascotas();
    }
  }

  ngOnInit(){
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        if (this.router.url.split('/')[2]) {
          this.ids = this.router.url.split('/')[2].split('-');
          this.mascotas = this.mascotasService.getMascotasByIds(this.ids);
        } else {
          this.mascotas = this.mascotasService.getMascotas();
        }
      }
    });
  }
}
