import { Component, Input } from '@angular/core';
import { MascotasService } from '../../services/data/mascotas.service';
import { Mascota } from '../../interfaces/mascota';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mascota',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatCardModule, 
    RouterModule, 
    CommonModule
  ],
  templateUrl: './mascota.component.html',
  styleUrl: './mascota.component.css',
})
export class MascotaComponent {
  mascotas: Mascota[];
  @Input('filter') infoDesdeNavbar!: string;

  constructor(public mascotasService: MascotasService) {
    this.mascotas = this.mascotasService.getMascotas();
  }
}
