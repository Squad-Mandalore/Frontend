import { Component, Input } from '@angular/core';
import { PasswordBoxComponent } from '../password-box/password-box.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/alert.service';
import { UtilService } from '../../shared/service-util';
import { AdminPatchSchema, AthletePatchSchema, TrainerPatchSchema, TrainersService, UserResponseSchema } from '../../shared/generated';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-initial-password-change-modal',
  standalone: true,
  imports: [PasswordBoxComponent, PrimaryButtonComponent, NgIf, ReactiveFormsModule],
  templateUrl: './initial-password-change-modal.component.html',
  styleUrl: './initial-password-change-modal.component.scss'
})

export class InitialPasswordChangeModalComponent {
  user: UserResponseSchema | null = null;
  
  formValidation: formValidation = {
    passwordDifference: false
  }
  passwordForm : FormGroup;
  constructor(private formBuilder: FormBuilder, private alertService: AlertService, private utilService: UtilService, private trainerService: TrainersService){
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordRepeat: ['', [Validators.required, utilService.passwordValidator()]]
    });
  }

  resetValidation(value: keyof formValidation){
    console.log("reset");
    if(this.formValidation && this.formValidation[value]) this.formValidation[value] = false;
  }

  validateValues() {
    console.log("trigger");
    const password = this.passwordForm.value.password;
    const passwordRepeat = this.passwordForm.value.passwordRepeat;
    console.log(this.passwordForm)
    if(password.length !== 0 && passwordRepeat.length === 0) return;
    if(password !== passwordRepeat) this.formValidation.passwordDifference = true;
  }

  onSubmit(){
    const password = this.passwordForm.value.password;
    const passwordRepeat = this.passwordForm.value.passwordRepeat;
    if(!this.user || password.length === 0 || passwordRepeat.length === 0 || password !== passwordRepeat) return;

    let body: TrainerPatchSchema | AthletePatchSchema | AdminPatchSchema= {
      // password: this.passwordForm.value.password
    }

    if(this.user.type === "administrator"){
      
    }
  }
}

interface formValidation {
  passwordDifference: boolean
}