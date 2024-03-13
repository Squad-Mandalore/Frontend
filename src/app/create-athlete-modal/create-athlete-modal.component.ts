import { Component } from '@angular/core';
import {IconComponent} from "../components/icon/icon.component";
import {PrimaryButtonComponent} from "../components/buttons/primary-button/primary-button.component";
import {SecondaryButtonComponent} from "../components/buttons/secondary-button/secondary-button.component";
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-create-athlete-modal',
  standalone: true,
  imports: [
    IconComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgClass
  ],
  templateUrl: './create-athlete-modal.component.html',
  styleUrl: './create-athlete-modal.component.scss'
})
export class CreateAthleteModalComponent {
  passwordStrength = "schwach";
  progressBarColor = "var(--danger)";
  showFirstPage: boolean = true;
  isMale: boolean = true;

  onClickSwitchPage() {
    this.showFirstPage = !this.showFirstPage;
  }

  onClickSwitchGender() {
    this.isMale = !this.isMale;
  }
}
