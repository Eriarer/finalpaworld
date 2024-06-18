import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-serach',
  standalone: true,
  imports: [],
  templateUrl: './nav-serach.component.html',
  styleUrl: './nav-serach.component.css',
})
export class NavSerachComponent {
  onClickSearch() {
    console.log('Search clicked');
  }
}
