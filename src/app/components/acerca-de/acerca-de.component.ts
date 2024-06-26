import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css']
})
export class AcercaDeComponent implements AfterViewInit {

  ngAfterViewInit() {
    let accordions = document.querySelectorAll(".accordion");
    accordions.forEach((accordion) => {
      accordion.addEventListener('click', () => {
        accordion.classList.toggle("active");
      });
    });
  }
}
