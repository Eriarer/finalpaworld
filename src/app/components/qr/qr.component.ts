import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [QRCodeModule, CommonModule],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css',
  inputs: ['datosUsuario', 'visible'],
})
export class QrComponent {
  visible: any;
  datosUsuario: any;
  qrWidht: number = 100;
  // bt breakpoints
  bs_sm: number = 576;
  bs_md: number = 768;
  bs_lg: number = 992;
  bs_xl: number = 1200;

  constructor() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  handleResize = () => {
    if (window.innerWidth < this.bs_sm) {
      this.qrWidht = 200;
    } else if (window.innerWidth < this.bs_md) {
      this.qrWidht = 300;
    } else if (window.innerWidth < this.bs_lg) {
      this.qrWidht = 400;
    } else if (window.innerWidth < this.bs_xl) {
      this.qrWidht = 500;
    } else {
      this.qrWidht = 600;
    }
  };
}
