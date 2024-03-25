import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrimaryButtonComponent } from '../components/buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../components/buttons/secondary-button/secondary-button.component';
import { IconComponent } from '../components/icon/icon.component';
import { PasswordBoxComponent } from '../components/password-box/password-box.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../alert/alert.component';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'app-create-trainer-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, IconComponent, PasswordBoxComponent, ReactiveFormsModule, AlertComponent],
  templateUrl: './create-trainer-modal.component.html',
  styleUrl: './create-trainer-modal.component.scss'
})
export class CreateTrainerModalComponent {
  @Output() click = new EventEmitter<any>();

  onButtonClick() {
    console.log("close");
    this.click.emit();
  }
  
  trainerForm;
  constructor(private formBuilder: FormBuilder, private alertService: AlertService){
    this.trainerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
  });
  }

  onSubmit(){
    console.log('createTrainer');
    if(false){
      this.click.emit();
    }else{
      this.alertService.show('Erstellung fehlgeschlagen','Bei der Erstellung ist etwas schief gelaufen! Bitte nochmal versuchen.',"error");
    }
  }
}
