import {Component, ElementRef, ViewChild, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {AlertComponent} from "../alert/alert.component";
import {IconComponent} from "../icon/icon.component";
import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {SecondaryButtonComponent} from "../buttons/secondary-button/secondary-button.component";
import {
  AthleteFullResponseSchema,
} from "../../shared/generated";
import {FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { LoggerService } from '../../shared/logger.service';

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
  @Output() fileCallback = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile?: File;

  constructor(
    private formBuilder: FormBuilder, private logger: LoggerService
  ) {
    // Initialize Form and Validators for received Data
    this.createAthleteForm = this.formBuilder.group({
      username: ['', Validators.required],
      unhashed_password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      gender: ['m', Validators.required],
      birthday: ['', Validators.required],
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
        birthday: this.selectedAthlete.birthday,
      })
      this.isMale = this.selectedAthlete.gender === "m";
    }
  }

  onSubmit() {
    if (this.createAthleteForm.invalid) {
      this.logger.error("Form invalid");
      return;
    }
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

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    this.onCSVSubmit();
  }

  onCSVSubmit(){
    if (!this.selectedFile) {
      return;
    }
    this.fileCallback.emit(this.selectedFile);
  }
}
