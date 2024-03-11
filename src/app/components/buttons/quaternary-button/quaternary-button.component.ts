import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-quaternary-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './quaternary-button.component.html',
  styleUrls: ['./quaternary-button.component.scss'],
})


export class QuaternaryButtonComponent {
  @Input() iconName: string = '';
  @Input() iconColor: string = "var(--accent-900)";
  @Input() description: string = '';
  @Input() minWidth: string = '39px';
  @Input() strokeWidth: string = '2.3';
  @Input() iconWidth: string = '15';
  @Input() iconHeight: string = '15';
  @Input() tooltipText: string = '';
}