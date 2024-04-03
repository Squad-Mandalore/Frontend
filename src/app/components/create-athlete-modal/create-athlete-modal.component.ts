import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {IconComponent} from "../icon/icon.component";
import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {SecondaryButtonComponent} from "../buttons/secondary-button/secondary-button.component";
import {AthletePostSchema, AthletesService, Gender} from "../../shared/generated";
import {LoggerService} from "../../shared/logger.service";
import {AlertService} from "../../shared/alert.service";
import {UtilService} from "../../shared/service-util";

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
    NgClass,
    PasswordBoxComponent,
    ReactiveFormsModule,
    FormsModule,
    AlertComponent
  ],
  templateUrl: './create-athlete-modal.component.html',
  styleUrl: './create-athlete-modal.component.scss'
})
export class CreateAthleteModalComponent implements OnInit {
  @Output() click = new EventEmitter<any>();
  createAthleteForm;
  showFirstPage: boolean = true;
  isMale: boolean = true;
  isSringMale: Gender = "m";
  @Input() modals!: any;

  constructor(private athleteApi: AthletesService,
              private logger: LoggerService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private utilService: UtilService

  ) {
    this.createAthleteForm = this.formBuilder.group({
      username: ['', Validators.required],
      unhashed_password: ['', [Validators.required, utilService.passwordValidator]],
      email: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.logger.info("gock")


    }

  onSubmit() {
    if (this.createAthleteForm.invalid){
      this.logger.error("Form invalid")
      return;
    }
    if (!this.isMale) {
      this.isSringMale = "f"
    }

    let body : AthletePostSchema = {
    username: this.createAthleteForm.value.username!,
    email: this.createAthleteForm.value.email!,
    unhashed_password: this.createAthleteForm.value.unhashed_password!,
    firstname: this.createAthleteForm.value.firstname!,
    lastname: this.createAthleteForm.value.lastname!,
    birthday: this.createAthleteForm.value.year! + "-" + this.createAthleteForm.value.month!.toString().padStart(2,'0') + "-" + this.createAthleteForm.value.day!.padStart(2,'0'),
    gender: this.isSringMale!
    }


      this.athleteApi.createAthleteAthletesPost(body).subscribe({
        next: () => {
          this.click.emit();
        },
        error: (error) => {
          if(error.status == 422){
            this.alertService.show('Erstellung fehlgeschlagen','Benutzername ist nicht verfügbar.',"error");
          }else{
            this.alertService.show('Erstellung fehlgeschlagen','Bei der Erstellung ist etwas schief gelaufen! Bitte nochmal versuchen.',"error");
          }
        }
    })
  }


  onClickSwitchPage() {
    this.showFirstPage = !this.showFirstPage;
  }

  onClickSwitchGender(value: string) {
    this.isMale = value === "male";
  }

  onButtonClick() {
    console.log("close");
    this.click.emit();
  }
}

