import { Component } from '@angular/core';
import { SidebarComponentComponent } from '../sidebar-component/sidebar-component.component';
import { NavbarBottomComponentComponent } from '../navbar-bottom-component/navbar-bottom-component.component';
import { AthleteResponseSchema } from '../shared/generated';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [SidebarComponentComponent, NavbarBottomComponentComponent],
    templateUrl: './dashboard-page.component.html',
    styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
    athletes: AthleteResponseSchema[] = [{
        id: '1',
        username: 'test1',
        email: 'test1@example.com',
        firstname: 'John',
        lastname: 'Doe',
        created_at: '2024-02-26',
        last_password_change: '2024-02-26',
        last_edited_at: '2024-02-26',
        gender: 'm',
        has_disease: false,
        birthday: '2024-02-25',
        trainer_id: 'tsa;lk',
        type: 'athlete',
    }, {
        id: '2',
        username: 'test2',
        email: 'test1@example.com',
        firstname: 'John',
        lastname: 'Doe',
        created_at: '2024-02-26',
        last_password_change: '2024-02-26',
        last_edited_at: '2024-02-26',
        gender: 'm',
        has_disease: false,
        birthday: '2024-02-25',
        trainer_id: 'tsa;lk',
        type: 'athlete',
    }, {
        id: '1',
        username: 'test1',
        email: 'test1@example.com',
        firstname: 'John',
        lastname: 'Doe',
        created_at: '2024-02-26',
        last_password_change: '2024-02-26',
        last_edited_at: '2024-02-26',
        gender: 'm',
        has_disease: false,
        birthday: '2024-02-25',
        trainer_id: 'tsa;lk',
        type: 'athlete',
    }, {
        id: '2',
        username: 'test2',
        email: 'test1@example.com',
        firstname: 'John',
        lastname: 'Doe',
        created_at: '2024-02-26',
        last_password_change: '2024-02-26',
        last_edited_at: '2024-02-26',
        gender: 'm',
        has_disease: false,
        birthday: '2024-02-25',
        trainer_id: 'tsa;lk',
        type: 'athlete',
    }]
    // athletes = [];
}
