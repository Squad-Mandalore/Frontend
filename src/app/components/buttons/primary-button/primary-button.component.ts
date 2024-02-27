import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="primary-button" [ngClass]="{ 'with-icon': showIcon }">
      <ng-container *ngIf="showIcon">
        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </ng-container>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./primary-button.component.scss'],
})


export class PrimaryButtonComponent {
  @Input() showIcon = true;
  @Input() text: string = '';
  @Input() icon: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
