import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {IconComponent} from "../icon/icon.component";
import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {SecondaryButtonComponent} from "../buttons/secondary-button/secondary-button.component";
import {AthletePostSchema, AthletesService} from "../../shared/generated";
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
  @Input() modals!: any;


  public athleteData: AthletePostSchema = {
    username: '',
    email: '',
    unhashed_password: '',
    firstname: '',
    lastname: '',
    birthday: '',
    gender: 'm',
  }

  constructor(
    private athleteApi: AthletesService,
    private logger: LoggerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private utilService: UtilService
  ){
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
    const { username, email, unhashed_password, firstname, lastname, day, month, year } = this.createAthleteForm.value;

    this.athleteData.username = username!
    this.athleteData.email = email!;
    this.athleteData.unhashed_password = unhashed_password!;
    this.athleteData.firstname = firstname!;
    this.athleteData.lastname = lastname!;
    this.athleteData.birthday = year! + "-" + month!.toString().padStart(2,'0') + "-" + day!.toString().padStart(2,'0');
    if (!this.isMale) {
      this.athleteData.gender = "f"
    }


      this.athleteApi.createAthleteAthletesPost(this.athleteData).subscribe({
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
}

