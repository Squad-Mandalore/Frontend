import { Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common"
import { AthleteResponseSchema } from '../shared/generated';

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

    @Input({ required: true }) user!: AthleteResponseSchema;

    circumference: number = 2 * Math.PI * 24;

    dashOffset(): number {
        const progressDecimal = this.progress / 100;
        return this.circumference * (1 - progressDecimal);
    }

    progressColor(): any {
        return `var(--${this.medal})`;
    }
}