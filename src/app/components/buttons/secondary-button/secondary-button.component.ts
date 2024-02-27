import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button class="secondary-button" [ngClass]="{ 'with-icon': showIcon }">
      <span>{{ text }}</span>
      <ng-container *ngIf="showIcon">
        <app-icon [iconName]="iconName" [iconColor]="iconColor"></app-icon>
      </ng-container>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./secondary-button.component.scss'],
})


export class SecondaryButtonComponent {
  @Input() showIcon: Boolean = false;
  @Input() text: string = '';
  @Input() iconName: string = '';
  @Input() iconColor: string = "var(--accent-900)";
}
