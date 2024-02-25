import { Component } from '@angular/core';
import { PasswordBoxComponent } from '../password-box/password-box.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [PasswordBoxComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
