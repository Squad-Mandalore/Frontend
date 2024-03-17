import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AthleteCardComponent } from '../athlete-card/athlete-card.component';
import { RouterLink } from '@angular/router';
import { AthleteResponseSchema } from '../shared/generated';

@Component({
    selector: 'app-sidebar-component',
    standalone: true,
    imports: [CommonModule, AthleteCardComponent, RouterLink],
    templateUrl: './sidebar-component.component.html',
    styleUrl: './sidebar-component.component.scss'
})
export class SidebarComponentComponent {
    @Input() athletes: AthleteResponseSchema[] = [];
}
