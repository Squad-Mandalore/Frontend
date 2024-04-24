import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {SecondaryButtonComponent} from "../buttons/secondary-button/secondary-button.component";
import {IconComponent} from "../icon/icon.component";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {AlertService} from "../../shared/alert.service";
import {UtilService} from "../../shared/service-util";
import {TrainerPostSchema, TrainerResponseSchema, TrainersService} from "../../shared/generated";
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-create-trainer-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, IconComponent, PasswordBoxComponent, ReactiveFormsModule, AlertComponent, NgClass, NgIf],
  templateUrl: './create-trainer-modal.component.html',
  styleUrl: './create-trainer-modal.component.scss',
})
export class CreateTrainerModalComponent {
  @Input() modals!: any;
  @Input() trainer!: TrainerResponseSchema[];

  formValidation: formValidation = {
    illegalPassword: false,
  }

  trainerForm;
  constructor(private formBuilder: FormBuilder, private alertService: AlertService, private utilService: UtilService, private trainerService: TrainersService){
    this.trainerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resetValidation(){
    this.formValidation.illegalPassword = false;
  }

  validateValues(){
    const password = this.trainerForm.value.password;

    if(this.utilService.validatePass(password!) === 'Illegal'){
      this.formValidation.illegalPassword = true;
    }else{
      this.resetValidation();
    }
    
    if(password!.length === 0) return;
  }

  onSubmit(){
    let body: TrainerPostSchema = {
      username: this.trainerForm.value.username!,
      unhashed_password: this.trainerForm.value.password!,
      firstname: this.trainerForm.value.firstname!,
      lastname: this.trainerForm.value.lastname!,
      email: this.trainerForm.value.email!,
    };

    this.validateValues();
    if(this.formValidation.illegalPassword === true) return;

    this.trainerService.createTrainerTrainersPost(body).subscribe({
      next: (reponse: TrainerResponseSchema) => {
        this.alertService.show('Trainer erstellt', 'Trainer wurde erfolgreich erstellt.', 'success');
        this.modals.createTrainerModal.isActive = false;
        this.trainer.push(reponse);
      },
      error: (error) => {
        if(error.status == 422){
          this.alertService.show('Erstellung fehlgeschlagen','Benutzername ist nicht verfügbar.',"error");
        }else{
          this.alertService.show('Erstellung fehlgeschlagen','Bitte versuche es später erneut',"error");
        }
      }
    });
  }
}

interface formValidation {
  illegalPassword: boolean,
}