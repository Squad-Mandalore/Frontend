import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { AthleteResponseSchema } from '../shared/generated';

@Component({
    selector: 'app-athlete-card',
    standalone: true,
    imports: [UserCardComponent, CommonModule],
    templateUrl: './athlete-card.component.html',
    styleUrl: './athlete-card.component.scss'
})

export class AthleteCardComponent {

    // add some logic for determining if user is active here
    numberGoldMedals = 3;
    numberSilverMedals = 4;
    numberBronzeMedals = 1;
    hasSwimmingCertificate = false;

    isActive = false;
    @Input({ required: true }) athlete!: AthleteResponseSchema;
}