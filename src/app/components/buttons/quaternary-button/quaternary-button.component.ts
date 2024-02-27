import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-quaternary-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button class="quaternary-button" [ngClass]="{ 'with-icon': showIcon }">
      <ng-container *ngIf="showIcon">
        <app-icon [iconName]="iconName" [iconColor]="iconColor"></app-icon>
      </ng-container>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./quaternary-button.component.scss'],
})


export class QuaternaryButtonComponent {
  @Input() showIcon: Boolean = true;
  @Input() iconName: string = '';
  @Input() iconColor: string = "var(--brand-900)";
}