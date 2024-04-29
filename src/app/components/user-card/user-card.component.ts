import { Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common"
import { UserResponseSchema } from '../../shared/generated';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})

export class UserCardComponent {
  @Input() showIconOnly: boolean = false;
  @Input() progress: number = 0;
  @Input() medal?: string;
  @Input() user?: UserResponseSchema;

  circumference: number = 2 * Math.PI * 24;

  dashOffset(): number {
    const progressDecimal = this.progress / 100;
    return this.circumference * (1 - progressDecimal);
  }
}
