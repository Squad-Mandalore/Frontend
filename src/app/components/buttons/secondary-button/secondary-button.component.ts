import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.scss'],
})


export class SecondaryButtonComponent {
  @Input() text: string = '';
  @Input() iconName: string = '';
  @Input() iconColor: string = "var(--accent-900)";
  @Input() description: string = '';
}
