import {Component, OnInit} from '@angular/core';
import {IconComponent} from "../components/icon/icon.component";
import {PrimaryButtonComponent} from "../components/buttons/primary-button/primary-button.component";
import {SecondaryButtonComponent} from "../components/buttons/secondary-button/secondary-button.component";
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {AthletePostSchema, AthleteResponseSchema, AthletesService} from "../shared/generated";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoggerService} from "../shared/logger.service";

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
    FormsModule
  ],
  templateUrl: './create-athlete-modal.component.html',
  styleUrl: './create-athlete-modal.component.scss'
})
export class CreateAthleteModalComponent implements OnInit {
  createAthleteForm;
  showFirstPage: boolean = true;
  isMale: boolean = true;

  constructor(private athleteApi: AthletesService,
              private logger: LoggerService,
              private formBuilder: FormBuilder
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
  }

  ngOnInit(): void {
    this.logger.info("maschalla" + this.athleteData)


    }


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


      this.athleteApi.createAthleteAthletesPost(this.athleteData).subscribe({
      next: (athlete: AthleteResponseSchema) => {
        this.logger.info(athlete.email)
      }
    })
    this.logger.info("Athlete created")

  }



  onClickSwitchPage() {
    this.showFirstPage = !this.showFirstPage;
  }

  onClickSwitchGender(value: string) {
    this.isMale = value === "male" ? true : false;
  }
}

