import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-user-state',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-user-state.component.html',
  styleUrl: './nav-user-state.component.css',
})
export class NavUserStateComponent {
  userLogged = true;
}
