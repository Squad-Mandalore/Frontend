import { Component } from '@angular/core';
import { PrimaryButtonComponent } from '../components/buttons/primary-button/primary-button.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [PrimaryButtonComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
