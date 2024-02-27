import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GrandparentComponent } from './grandparent/grandparent.component';
import { LoginPageComponent } from './login-page/login-page.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, GrandparentComponent, LoginPageComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title: boolean = false;
    isChecked = false;
    alertMethode(value: string) {
        this.title = true;
    }
}
