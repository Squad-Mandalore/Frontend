import { Component, OnInit } from '@angular/core';
import { PasswordBoxComponent } from '../password-box/password-box.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [PasswordBoxComponent, JsonPipe, ReactiveFormsModule],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
    formGroup: FormGroup = this.formBuilder.group({
        username: [''],
        password: ['']
    });

    ngOnInit(): void {
    }

    constructor(private formBuilder: FormBuilder) { }
}
