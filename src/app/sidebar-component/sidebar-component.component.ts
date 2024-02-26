import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-component',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-component.component.html',
  styleUrl: './sidebar-component.component.scss'
})
export class SidebarComponentComponent {
  @Input() athletes = []
}
