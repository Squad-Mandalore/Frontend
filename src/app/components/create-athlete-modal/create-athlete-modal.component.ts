import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {AlertComponent} from "../alert/alert.component";
import {IconComponent} from "../icon/icon.component";
import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {SecondaryButtonComponent} from "../buttons/secondary-button/secondary-button.component";
import {
  AthleteFullResponseSchema,
  AthletePatchSchema,
  AthletePostSchema,
  AthleteResponseSchema,
  AthletesService,
  Gender
} from "../../shared/generated";
import {LoggerService} from "../../shared/logger.service";
import {AlertService} from "../../shared/alert.service";
import {UtilService} from "../../shared/service-util";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

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
  @Input({required: true}) modal: any;
  @Input() selectedAthlete?: AthleteFullResponseSchema;
  @Output() athleteCallback = new EventEmitter<FormGroup>();

  constructor(private athleteApi: AthletesService,
              private logger: LoggerService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private utilService: UtilService,

  ) {
    // Initialize Form and Validators for received Data
    this.createAthleteForm = this.formBuilder.group({
      username: ['', Validators.required],
      unhashed_password: ['', [Validators.required, this.utilService.passwordValidator()]],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      gender: ['m', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
    });
  }

  ngOnInit() {
    if(this.selectedAthlete){
      Object.keys(this.createAthleteForm.controls).forEach(key => {
        this.createAthleteForm.get(key)!.removeValidators(Validators.required);
        this.createAthleteForm.get(key)!.updateValueAndValidity();
      });
      this.createAthleteForm.patchValue({
        username: this.selectedAthlete.username,
        email: this.selectedAthlete.email,
        firstname: this.selectedAthlete.firstname,
        lastname: this.selectedAthlete.lastname,
        gender: this.selectedAthlete.gender,
        day: this.selectedAthlete.birthday.split("-")[2],
        month: this.selectedAthlete.birthday.split("-")[1],
        year: this.selectedAthlete.birthday.split("-")[0],
      })
      this.isMale = this.selectedAthlete.gender === "m";
    }
  }

  onSubmit() {
    this.athleteCallback.emit(this.createAthleteForm);
  }

  // Page-Switch
  onClickSwitchPage() {
    this.showFirstPage = !this.showFirstPage;
  }

  // clickable div for Gender
  onClickSwitchGender(value: string) {
    this.isMale = value === "male";
    this.createAthleteForm.patchValue({ gender: this.isMale ? "m" : "f" });
  }

}

