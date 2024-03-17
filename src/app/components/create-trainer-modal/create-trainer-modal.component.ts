import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../buttons/secondary-button/secondary-button.component';
import { IconComponent } from '../icon/icon.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-create-trainer-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, IconComponent, PrimaryButtonComponent, NgClass],
  templateUrl: './create-trainer-modal.component.html',
  styleUrl: './create-trainer-modal.component.scss'
})
export class CreateTrainerModalComponent {
  @Input() isActive: boolean = false;

  @Output() closeModal = new EventEmitter<boolean>();
  close(value: boolean){
    this.closeModal.emit(value);
  }

  passwordStrength = "schwach";
  progressBarColor = "var(--danger)";
}
