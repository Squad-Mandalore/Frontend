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
  @Input() progress: number = this.getRandomNumber(); // 0
  @Input() medal: string = this.getRandomMedalStatus(); // none

  getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  getRandomMedalStatus() {
    const medalStatusOptions = ["none", "gold", "silver", "bronze"];
    const randomIndex = Math.floor(Math.random() * medalStatusOptions.length);
    return medalStatusOptions[randomIndex];
  }
  

  @Input() user!: User;

  circumference: number = 2 * Math.PI * 24;

  dashOffset(): number {
    const progressDecimal = this.progress / 100;
    return this.circumference * (1 - progressDecimal);
  }

  progressColor() : any {
    return `var(--${this.medal})`;
  }

  user_example = {
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


interface User {
  id: string,
  firstname: string,
  lastname: string,
  type: string,
}