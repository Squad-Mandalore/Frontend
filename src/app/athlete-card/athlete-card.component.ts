import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-athlete-card',
  standalone: true,
  imports: [UserCardComponent, CommonModule],
  templateUrl: './athlete-card.component.html',
  styleUrl: './athlete-card.component.scss'
})
export class AthleteCardComponent {
  hasSwimmingCertificate=false;
  numberGoldMedals=1;
  numberSilverMedals=1;
  numberBronzeMedals=1;
  isActive=false;
}
