import {Component, OnInit} from '@angular/core';
import {IconComponent} from "../components/icon/icon.component";
import {PrimaryButtonComponent} from "../components/buttons/primary-button/primary-button.component";
import {SecondaryButtonComponent} from "../components/buttons/secondary-button/secondary-button.component";
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {AthletePostSchema, AthleteResponseSchema, AthletesService} from "../shared/generated";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoggerService} from "../shared/logger.service";
import {AlertComponent} from "../alert/alert.component";
import {Router} from "@angular/router";
import {timeout} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

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
  createAthleteForm;
  showFirstPage: boolean = true;
  isMale: boolean = true;

  alertTitle?: string;
  alertDescription?: string;
  isSuccess: boolean;
  closeAlert;
  timeout!: ReturnType<typeof setTimeout>;


  public athleteData: AthletePostSchema = {
    username: '',
    email: '',
    unhashed_password: '',
    firstname: '',
    lastname: '',
    birthday: '',
    gender: 'm',
    has_disease: false,
    trainer_id: '',
  }

  constructor(private athleteApi: AthletesService,
              private logger: LoggerService,
              private formBuilder: FormBuilder,
              private router: Router,

  ) {
    this.createAthleteForm = this.formBuilder.group({
      username: ['', Validators.required],
      unhashed_password: ['', Validators.required],
      email: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
    })

    this.isSuccess= false;
    this.closeAlert = () => {
      clearTimeout(this.timeout);
      this.isSuccess = false;
    }
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
      next: (athlete: AthleteResponseSchema) => {
        this.displayAlert(athlete.firstname);
        this.logger.info(athlete.firstname + " " + athlete.lastname + " wurde Erstellt")
      },
      error: (error: HttpErrorResponse) => {
        this.logger.error(`Error ${error.message}`)
      }
    })
  }

  displayAlert(username: string ) {
    if (this.isSuccess) {
      return;
    }
    this.alertTitle = 'Neuer Sportler wurde erstellt';
    this.alertDescription = `${username} wurde den Athleten hinzugefügt`;
    this.isSuccess = true;
    this.timeout = setTimeout(this.closeAlert, 4000);
  }



  onClickSwitchPage() {
    this.showFirstPage = !this.showFirstPage;
  }

  onClickSwitchGender(value: string) {
    this.isMale = value === "male";
  }
}

