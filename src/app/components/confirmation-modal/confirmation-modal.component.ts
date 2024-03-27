import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../buttons/secondary-button/secondary-button.component';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  @Input() modalTitle!: string;
  @Input() modalDescription!: string;
  @Input() primaryButtonText!: string;
  @Input() secondaryButtonText!: string;
  @Input() iconName: string = "";
  @Input() isDeleteButton: boolean = false;

  @Output() primaryButtonClick = new EventEmitter<Event>();
  delegatePrimaryEvent(){
    this.primaryButtonClick.emit();
  }

  @Output() secondaryButtonClick = new EventEmitter<Event>();
  delegateSecondaryEvent(){
    this.secondaryButtonClick.emit();
  }

  @Output() closeButtonClick = new EventEmitter<Event>();
  delegateCloseEvent(){
    this.closeButtonClick.emit();
  }
}
