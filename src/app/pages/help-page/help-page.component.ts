import { Component } from '@angular/core';
import { NavbarBottomComponent } from '../../components/navbar-bottom/navbar-bottom.component';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [NavbarBottomComponent],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.scss'
})
export class HelpPageComponent {
}
