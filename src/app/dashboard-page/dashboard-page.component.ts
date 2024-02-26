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

}
