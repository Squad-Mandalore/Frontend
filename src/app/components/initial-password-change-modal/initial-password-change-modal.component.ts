import { Component, Input } from '@angular/core';
import { PasswordBoxComponent } from '../password-box/password-box.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/alert.service';
import { UtilService } from '../../shared/service-util';
import { AdminPatchSchema, AdminResponseSchema, AdminsService, AthletePatchSchema, AthletesService, TrainerPatchSchema, TrainersService, UserResponseSchema } from '../../shared/generated';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-initial-password-change-modal',
  standalone: true,
  imports: [PasswordBoxComponent, PrimaryButtonComponent, NgIf, ReactiveFormsModule],
  templateUrl: './initial-password-change-modal.component.html',
  styleUrl: './initial-password-change-modal.component.scss'
})

export class InitialPasswordChangeModalComponent {
  @Input() user?: UserResponseSchema;
  @Input() oldPassword?: string;
  
  formValidation: formValidation = {
    passwordDifference: false,
    oldPassword: false,
    illegalPassword: false,
  }

  passwordForm : FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private alertService: AlertService, private utilService: UtilService, private trainerService: TrainersService, private athleteService: AthletesService, private adminService: AdminsService){
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      passwordRepeat: ['', [Validators.required]]
    });
  }

  resetValidation(value: keyof formValidation){
    if(this.formValidation && this.formValidation[value]) this.formValidation[value] = false;
  }

  validateValues(){
    const password = this.passwordForm.value.password;
    const passwordRepeat = this.passwordForm.value.passwordRepeat;
    
    if(this.oldPassword === password){
      this.formValidation.oldPassword = true;
    }else{
      this.resetValidation('oldPassword');
    }

    if(this.utilService.validatePass(password) === 'Illegal'){
      this.formValidation.illegalPassword = true;
    }else{
      this.resetValidation('illegalPassword');
    }
    
    //ich finds kinda useless aber idk/idc; LG BB223
    if(password.length === 0 || passwordRepeat.length === 0) return;
    if(password !== passwordRepeat) this.formValidation.passwordDifference = true;
  }

  onSubmit(){
    const password = this.passwordForm.value.password;
    const passwordRepeat = this.passwordForm.value.passwordRepeat;

    if(!this.user || password !== passwordRepeat) return;

    if(!this.oldPassword || this.oldPassword === password){
      this.formValidation.oldPassword = true;
      return;
    }

    let body: TrainerPatchSchema | AthletePatchSchema | AdminPatchSchema= {
      unhashed_password: password
    };

    let updateFunction;
    switch (this.user.type) {
      case 'administrator':
        updateFunction = this.adminService.updateAdminAdminsIdPatch(this.user.id, body);
        break;
      case 'trainer':
        updateFunction = this.trainerService.updateTrainerTrainersIdPatch(this.user.id, body);
        break;
      case 'athlete':
        updateFunction = this.athleteService.updateAthleteAthletesIdPatch(this.user.id, body);
        break;
      default:
        this.alertService.show('Passwort ändern fehlgeschlagen','Bitte versuche es später erneut',"error");
        return;
    }

    updateFunction.subscribe({
      next: (response) => {
        this.alertService.show('Passwort erfolgreich geändert', 'Sie können sich nun mit dem neuen Passwort anmelden', 'success');
        this.router.navigate(['/athleten']);
      },
      error: (error) => {
        this.alertService.show('Passwort ändern fehlgeschlagen','Bitte versuche es später erneut',"error");
      }
    });
  }
}

interface formValidation {
  passwordDifference: boolean,
  oldPassword: boolean,
  illegalPassword: boolean,
}