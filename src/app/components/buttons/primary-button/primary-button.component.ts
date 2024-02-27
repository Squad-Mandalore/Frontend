import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button class="primary-button" [ngClass]="{ 'with-icon': showIcon }">
      <span>{{ text }}</span>
      <ng-container *ngIf="showIcon">
        <app-icon [iconName]="iconName" [iconColor]="iconColor" [iconHeight]="'15px'" [iconWidth]="'15px'" [strokeWidth]="'2.5'"]></app-icon>
      </ng-container>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./primary-button.component.scss'],
})


export class PrimaryButtonComponent {
  @Input() showIcon: Boolean = false;
  @Input() text: string = '';
  @Input() iconName: string = '';
  @Input() iconColor: string = "var(--accent-50)";
}
