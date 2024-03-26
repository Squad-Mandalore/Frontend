import { Component } from '@angular/core';
import { PrimaryButtonComponent } from '../components/buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../components/buttons/secondary-button/secondary-button.component';

@Component({
  selector: 'app-discipline-menu',
  standalone: true,
  imports: [PrimaryButtonComponent,SecondaryButtonComponent],
  templateUrl: './discipline-menu.component.html',
  styleUrl: './discipline-menu.component.scss'
})
export class DisciplineMenuComponent {

}
