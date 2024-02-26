import { Component } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-bottom-component',
  standalone: true,
  imports: [UserCardComponent, CommonModule],
  templateUrl: './navbar-bottom-component.component.html',
  styleUrl: './navbar-bottom-component.component.scss'
})
export class NavbarBottomComponentComponent {
  isActive: boolean = true; // logik für active state hier
  user = {
    id: '1',
    firstname: 'Kay',
    lastname: 'Schulz',
    type: 'Administrator',
    username: 'KaySchulz42'
  }
}
