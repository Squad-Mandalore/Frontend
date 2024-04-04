import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../buttons/secondary-button/secondary-button.component';
import { ConfirmationService } from '../../shared/confirmation.service';
import { NgIf } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, NgIf, IconComponent],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  constructor(protected confirmationService: ConfirmationService){}
}
