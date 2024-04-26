import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {SecondaryButtonComponent} from "../buttons/secondary-button/secondary-button.component";
import {IconComponent} from "../icon/icon.component";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {AlertService} from "../../shared/alert.service";
import {UtilService} from "../../shared/service-util";
import {TrainerResponseSchema, TrainersService} from "../../shared/generated";
import {NgClass, NgIf} from "@angular/common";
import { LoggerService } from "../../shared/logger.service";

@Component({
  selector: 'app-create-trainer-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, IconComponent, PasswordBoxComponent, ReactiveFormsModule, AlertComponent, NgClass, NgIf],
  templateUrl: './create-trainer-modal.component.html',
  styleUrl: './create-trainer-modal.component.scss',
})
export class CreateTrainerModalComponent implements OnInit{
  @Input({required: true}) modal: any;
  @Input() selectedTrainer?: TrainerResponseSchema;
  @Output() trainerCallback = new EventEmitter<FormGroup>();

  formValidation: formValidation = {
    illegalPassword: false,
  }

  trainerForm;
  constructor(private formBuilder: FormBuilder, private alertService: AlertService, private utilService: UtilService, private trainerService: TrainersService, private logger: LoggerService){
    this.trainerForm = this.formBuilder.group({
      username: ['', Validators.required],
      unhashed_password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resetValidation(){
    this.formValidation.illegalPassword = false;
  }

  validateValues(){
    const password = this.trainerForm.value.unhashed_password;

    if(this.utilService.validatePass(password!) === 'Illegal'){
      this.formValidation.illegalPassword = true;
    }else{
      this.resetValidation();
    }
    
    if(password!.length === 0) return;
  }

  ngOnInit() {
    if(this.selectedTrainer){
      Object.keys(this.trainerForm.controls).forEach(key => {
        this.trainerForm.get(key)!.removeValidators(Validators.required);
        this.trainerForm.get(key)!.updateValueAndValidity();
      });
      this.trainerForm.patchValue({
        username: this.selectedTrainer.username,
        email: this.selectedTrainer.email,
        firstname: this.selectedTrainer.firstname,
        lastname: this.selectedTrainer.lastname,
      })
    }
  }

  onSubmit(){
    this.validateValues();
    if(this.formValidation.illegalPassword === true) return;

    this.trainerCallback.emit(this.trainerForm);
  }
}

interface formValidation {
  illegalPassword: boolean,
}