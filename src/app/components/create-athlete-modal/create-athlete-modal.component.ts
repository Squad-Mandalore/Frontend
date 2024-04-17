import {Component, ElementRef, Input, ViewChild} from '@angular/core';

import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {AlertComponent} from "../alert/alert.component";
import {IconComponent} from "../icon/icon.component";
import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {SecondaryButtonComponent} from "../buttons/secondary-button/secondary-button.component";
import {
  AthleteFullResponseSchema,
  AthletePostSchema,
  AthleteResponseSchema,
  AthletesService,
  CsvService,
  Gender,
  ResponseParseCsvFileCsvParsePost
} from "../../shared/generated";
import {LoggerService} from "../../shared/logger.service";
import {AlertService} from "../../shared/alert.service";
import {UtilService} from "../../shared/service-util";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpErrorResponse} from '@angular/common/http';

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
export class CreateAthleteModalComponent {
  createAthleteForm;
  showFirstPage: boolean = true;
  isMale: boolean = true;
  isStringMale: Gender = "m";
  @Input() modals!: any;
  @Input() athletes: AthleteFullResponseSchema[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;

  constructor(private athleteService: AthletesService,
              private logger: LoggerService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private utilService: UtilService,
              private csvService: CsvService,

  ) {
    // Initialize Form and Validators for received Data
    this.createAthleteForm = this.formBuilder.group({
      username: ['', Validators.required],
      unhashed_password: ['', [Validators.required, this.utilService.passwordValidator]],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
    })
  }

  onSubmit() {
    if (this.createAthleteForm.invalid){
      this.logger.error("Form invalid")
      return;
    }
    // For switch between Male / Female, because clickable div is used
    if (!this.isMale) {
      this.isStringMale = "f"
    }

    // Get date values from the Form
    const day = this.createAthleteForm.value.day!
    const month = this.createAthleteForm.value.month!
    const year = this.createAthleteForm.value.year!

    // Add Data for the Http-Request for the Backend
    const body : AthletePostSchema = {
    username: this.createAthleteForm.value.username!,
    email: this.createAthleteForm.value.email!,
    unhashed_password: this.createAthleteForm.value.unhashed_password!,
    firstname: this.createAthleteForm.value.firstname!,
    lastname: this.createAthleteForm.value.lastname!,
    birthday: year + "-" + month.toString().padStart(2,'0') + "-" + day.toString().padStart(2,'0'), // Format Birthday for Backend
    gender: this.isStringMale!
    }

    // Http-Request for Post of the Athlete to the Backend
    this.athleteService.createAthleteAthletesPost(body).subscribe({
      // Post Athlete if allowed
      next: (response: AthleteResponseSchema) => {
        this.alertService.show('Athlet erstellt', 'Athlet wurde erfolgreich erstellt.', 'success');
        this.modals.createAthleteModal.isActive = false;
        console.log(response)
        if(response && response.id){
          this.athleteService.getAthleteFullAthletesIdFullGet(response.id).subscribe({
            // Post Athlete if allowed
            next: (response: AthleteFullResponseSchema) => {
              if(response){
                this.athletes.push(response)
                console.log(this.athletes)
              }
            },
            // Deny Athlete if Backend send Http-Error
            error: (error) => {
              if(error.status == 422){
                this.alertService.show('Erstellung fehlgeschlagen','Benutzername ist nicht verfügbar.',"error");
              }else{
                this.alertService.show('Erstellung fehlgeschlagen','Bei der Erstellung ist etwas schief gelaufen',"error");
              }
            }
          })
        }
      },
      // Deny Athlete if Backend send Http-Error
      error: (error) => {
        if(error.status == 422){
          this.alertService.show('Erstellung fehlgeschlagen','Benutzername ist nicht verfügbar.',"error");
        }else{
          this.alertService.show('Erstellung fehlgeschlagen','Bei der Erstellung ist etwas schief gelaufen',"error");
        }
      }
  })

  }

  // Page-Switch
  onClickSwitchPage() {
    this.showFirstPage = !this.showFirstPage;
  }

  // clickable div for Gender
  onClickSwitchGender(value: string) {
    this.isMale = value === "male";
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

    this.csvService.parseCsvFileCsvParsePost(this.selectedFile).subscribe({
      next: (response: ResponseParseCsvFileCsvParsePost) => {
        let arr: string[] = [];
        Object.keys(response).forEach((key) => {
          const value = (response as any)[key];
          arr.push(`${key}: ${value}`);
        });
        let str: string = '';
        for (const strt of arr) {
          str += strt + '\n';
        }
        this.alertService.show('ERFOLG!', str, 'success');
        this.modals.createAthleteModal.isActive = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('FEHLSCHLAG!', error.error.detail, 'error');
      },
    })
    // this.athletes = []
    // this.athleteService.getAllAthletesAthletesGet().subscribe({
    //   next: (athletes: AthleteResponseSchema[]) => {
    //     for(const athlete of athletes){
    //       this.athleteService.getAthleteFullAthletesIdFullGet(athlete.id).subscribe({
    //         next: (fullAthleteObject: AthleteFullResponseSchema) => {
    //           this.athletes.push(fullAthleteObject);
    //         },
    //       })
    //     }
    //   }
    // })
  }

}

