import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AthleteCardComponent } from '../athlete-card/athlete-card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-component',
  standalone: true,
  imports: [CommonModule, AthleteCardComponent, RouterModule],
  templateUrl: './sidebar-component.component.html',
  styleUrl: './sidebar-component.component.scss'
})
export class SidebarComponentComponent {
  @Input() athletes:any = [];
}
