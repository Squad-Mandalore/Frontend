import { Component } from '@angular/core';
import { SidebarComponentComponent } from '../sidebar-component/sidebar-component.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [SidebarComponentComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  athletes = [{
    id: '1',
    username: 'test1',
    email: 'test1@example.com',
    firstname: 'John',
    lastname: 'Doe',
    created_at: '2024-02-26',
    last_password_change: '2024-02-26',
    last_edited_at: '2024-02-26',
    type: 'Runner',
    numberBronzeMedals: 2,
    numberSilverMedals: 3,
    numberGoldMedals: 1,
    hasSwimmingCertificate: false,
  },{
    id: '2',
    username: 'test2',
    email: 'test1@example.com',
    firstname: 'John',
    lastname: 'Doe',
    created_at: '2024-02-26',
    last_password_change: '2024-02-26',
    last_edited_at: '2024-02-26',
    type: 'Runner',
    numberBronzeMedals: 1,
    numberSilverMedals: 1,
    numberGoldMedals: 4,
    hasSwimmingCertificate: false,
  },{
    id: '1',
    username: 'test1',
    email: 'test1@example.com',
    firstname: 'John',
    lastname: 'Doe',
    created_at: '2024-02-26',
    last_password_change: '2024-02-26',
    last_edited_at: '2024-02-26',
    type: 'Runner',
    numberBronzeMedals: 2,
    numberSilverMedals: 3,
    numberGoldMedals: 1,
    hasSwimmingCertificate: false,
  },{
    id: '2',
    username: 'test2',
    email: 'test1@example.com',
    firstname: 'John',
    lastname: 'Doe',
    created_at: '2024-02-26',
    last_password_change: '2024-02-26',
    last_edited_at: '2024-02-26',
    type: 'Runner',
    numberBronzeMedals: 1,
    numberSilverMedals: 1,
    numberGoldMedals: 4,
    hasSwimmingCertificate: false,
  }]
  // athletes = [];
}
