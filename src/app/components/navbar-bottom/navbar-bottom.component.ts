import { Component } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-navbar-bottom',
  standalone: true,
  imports: [UserCardComponent, CommonModule, RouterModule],
  templateUrl: './navbar-bottom.component.html',
  styleUrl: './navbar-bottom.component.scss'
})
export class NavbarBottomComponent {
  urlParts: any = [];

  constructor(private route: ActivatedRoute) {
    this.urlParts = this.route.snapshot.url.map(segment => segment.toString());
  }

  checkIfIsActive(routeParameter : string){
    return this.urlParts.includes(routeParameter);
  }

  user = {
    id: 1,
    firstname: 'Kay',
    lastname: 'Schulz',
    type: 'Administrator',
    username: 'KaySchulz42'
  }
}
