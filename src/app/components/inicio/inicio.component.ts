import { Component } from '@angular/core';
import { DomseguroPipe } from './domseguro.pipe';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [DomseguroPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  video: string = "IPBB2iyVq7w";
}
