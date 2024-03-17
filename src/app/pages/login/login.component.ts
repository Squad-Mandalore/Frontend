import { Component } from '@angular/core';
import { PrimaryButtonComponent } from '../../components/buttons/primary-button/primary-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PrimaryButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
