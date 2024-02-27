import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../user';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
    @Input() title: boolean = false;
    @Input() Usersdf: User = { username: 'hllo', password: 'test' };
    @Output() user = new EventEmitter<User>()

    loginForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    })

    constructor(private fb: FormBuilder) { }

    onSubmit() {
        window.alert(this.loginForm.value.password);

        this.Usersdf.password = this.loginForm.value.password;
        this.Usersdf.username = this.loginForm.value.username;


        this.user.emit(this.Usersdf);
    }
}
