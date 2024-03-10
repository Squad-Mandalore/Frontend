import { Component } from '@angular/core';
import { PrimaryButtonComponent } from '../components/buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../components/buttons/secondary-button/secondary-button.component';
import { IconComponent } from '../components/icon/icon.component';

@Component({
  selector: 'app-create-trainer-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, IconComponent, PrimaryButtonComponent],
  templateUrl: './create-trainer-modal.component.html',
  styleUrl: './create-trainer-modal.component.scss'
})
export class CreateTrainerModalComponent {
  passwordStrength = "schwach";
  progressBarColor = "var(--danger)";
}
