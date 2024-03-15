import { Component, Input } from '@angular/core';
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

  // add some logic for determining if user is active here

  isActive = false;
  @Input() athlete!: Athlete;
}

interface Athlete {
  id: string,
  username: string,
  email: string,
  firstname: string,
  lastname: string,
  created_at: string,
  last_password_change: string,
  last_edited_at: string,
  type: string,
  numberBronzeMedals: number,
  numberSilverMedals: number,
  numberGoldMedals: number,
  hasSwimmingCertificate: boolean
}