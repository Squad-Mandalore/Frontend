import { Component } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthExtentionService } from '../shared/auth-extention.service';
import { AthleteResponseSchema } from '../shared/generated';

@Component({
    selector: 'app-navbar-bottom-component',
    standalone: true,
    imports: [UserCardComponent, CommonModule, RouterModule],
    templateUrl: './navbar-bottom-component.component.html',
    styleUrl: './navbar-bottom-component.component.scss'
})
export class NavbarBottomComponentComponent {
    constructor(private authExtService: AuthExtentionService) {
    }

    onClick() {
        this.authExtService.logout();
    }

    user: AthleteResponseSchema = {
        id: '1',
        firstname: 'Kay',
        lastname: 'Schulz',
        type: 'Administrator',
        username: 'KaySchulz42',
        email: 'test1@example.com',
        created_at: '2024-02-26',
        last_password_change: '2024-02-26',
        last_edited_at: '2024-02-26',
        gender: 'm',
        has_disease: false,
        birthday: '2024-02-25',
        trainer_id: 'tsa;lk',
    }
}
