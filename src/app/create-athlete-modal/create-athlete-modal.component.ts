import {Component, OnInit} from '@angular/core';
import {IconComponent} from "../components/icon/icon.component";
import {PrimaryButtonComponent} from "../components/buttons/primary-button/primary-button.component";
import {SecondaryButtonComponent} from "../components/buttons/secondary-button/secondary-button.component";
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {AthletePostSchema, AthleteResponseSchema, AthletesService} from "../shared/generated";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
  PageOneForm;
  PageTwoForm;
  showFirstPage: boolean = true;
  isMale: boolean = true;

  username = new FormControl('', {nonNullable: true,});
  email=  new FormControl('', {nonNullable: true,});
  unhashed_password = new FormControl('', {nonNullable: true,});
  firstname= new FormControl('', {nonNullable: true,});
  lastname = new FormControl('', {nonNullable: true,});
  day = new FormControl('', {nonNullable: true,});
  month = new FormControl('', {nonNullable: true,});
  year = new FormControl('', {nonNullable: true,});


  constructor(private athleteApi: AthletesService,
              private logger: LoggerService,
              private formBuilder: FormBuilder
  ) {
    this.PageOneForm = this.formBuilder.group({
      username: ['', Validators.required],
      unhashed_password: ['', Validators.required],
      email: ['', Validators.required]
    })
    this.PageTwoForm = this.formBuilder.group({
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



  athleteData: AthletePostSchema = {
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
    this.athleteData = {
      username: this.username.value,
      email: this.email.value,
      unhashed_password: this.unhashed_password.value,
      firstname: this.firstname.value,
      lastname: this.lastname.value,
      birthday: this.year.value + "-" + this.month.value + "-" + this.day.value,
      gender: 'm',
      has_disease: false,
      trainer_id: "",

    }

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

