import { Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common"

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
  @Input() medal: string = 'none';

  circumference: number = 2 * Math.PI * 24;

  dashOffset(): number {
    const progressDecimal = this.progress / 100;
    return this.circumference * (1 - progressDecimal);
  }

  progressColor() : any {
    return `var(--${this.medal})`;
  }

  user = {
    id: 1,
    username: "KaySchulz42",
    email: "kay@schulz.de",
    hashed_password: 'aöjsdlföajsdfu980asputt2098qouhZozpfaöeödfj-ma.rä2ojtqpdozf8asoidghfnööajisädfp0q###adf1iu89r173!',
    firstname: 'Kay',
    lastname: 'Schulz',
    created_at: '2024-02-25',
    last_password_change: '2024-02-25',
    last_edited_at: '2024-02-25',
    type: "Sportler",
    salt: ""
  }
}
