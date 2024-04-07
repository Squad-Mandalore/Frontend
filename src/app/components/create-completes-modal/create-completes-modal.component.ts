import {NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {IconComponent} from "../icon/icon.component";
import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {AthleteCompletesResponseSchema, AthleteFullResponseSchema, AthletePostSchema, AthletesService, CategoriesService, CategoryFullResponseSchema, CategoryVeryFullResponseSchema, CompletesResponseSchema} from "../../shared/generated";
import {LoggerService} from "../../shared/logger.service";
import {AlertService} from "../../shared/alert.service";
import {UtilService} from "../../shared/service-util";
import { SecondaryButtonComponent } from "../buttons/secondary-button/secondary-button.component";
import { Component, Input, OnInit } from "@angular/core";
import {CompletesPostSchema, CompletesService} from "../../shared/generated";
import { HttpErrorResponse } from "@angular/common/http";
import { ResponseGetCategoriesByAthleteIdCategoriesGet } from "../../shared/generated";



@Component({
  selector: 'app-create-completes',
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
    AlertComponent,
    NgFor
  ],
  templateUrl: './create-completes-modal.component.html',
  styleUrl: './create-completes-modal.component.scss'
})

export class CreateCompletesComponent implements OnInit{
  createCompletesForm;
  pageShow = 1;
  categories: ResponseGetCategoriesByAthleteIdCategoriesGet = [];
  @Input() selectedAthlete!: AthleteFullResponseSchema | null;
  @Input() modals!: any;

  time = {
    hours: null,
    minutes: null,
    seconds: null,
    milliseconds: null
  };

  distance = {
    kilometers: null,
    meters: null,
    centimeters: null
  }

  public completesData: CompletesPostSchema = {
    exercise_id: '',
    athlete_id: '',
    result: '',
    points: 0,
  }

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private utilService: UtilService,
    private completesService: CompletesService,
    private categoriesService: CategoriesService

  ){
    this.createCompletesForm = this.formBuilder.group({
      exercise_id: ['', Validators.required],
      athlete_id: ['', Validators.required],
      tracked_at: ['0', Validators.required],
      result: ['', Validators.required],
      points: ['0', Validators.required],
      hours: ['', Validators.required],
      minutes: ['', Validators.required],
      seconds: ['', Validators.required],
      milliseconds: ['', Validators.required],
      kilometers: ['', Validators.required],
      meters: ['', Validators.required],
      centimeters: ['', Validators.required],
    })
  }

  onSubmit() {
    const { exercise_id, athlete_id, result } = this.createCompletesForm.value;
  

    //if(this.createExerciseForm.value.hours != ''){
      const hours = +this.createCompletesForm.value.hours!;
      const minutes = +this.createCompletesForm.value.minutes!;
      const seconds = +this.createCompletesForm.value.seconds!;
      const milliseconds = +this.createCompletesForm.value.milliseconds!;

      this.completesData.result = this.submitNewTime(hours, minutes, seconds, milliseconds);
    //}

    if(this.createCompletesForm.value.kilometers != ''){
      const kilometers = +this.createCompletesForm.value.kilometers!;
      const meters = +this.createCompletesForm.value.meters!;
      const centimeters = +this.createCompletesForm.value.centimeters!;

      this.completesData.result = this.submitNewDistance(kilometers, meters, centimeters);
    }
  

    this.completesData.exercise_id = exercise_id!;
    this.completesData.exercise_id = '0c4c0678-5e56-4170-a1cb-3eda7540f96b';
    this.completesData.athlete_id = athlete_id!;
    this.completesData.athlete_id = '4d175c47-bf03-4ab8-8ef4-0e4c1f12a331';

      this.completesService.createCompletesCompletesPost(this.completesData).subscribe({
        next: (response: CompletesResponseSchema) => {
          this.alertService.show('Eintrag erfasst', 'Eintrag wurde erfolgreich hinzugefügt.', 'success');
          this.modals.createCompletesModal.isActive = false;
          console.log(response);
          // if(this.selectedAthlete) this.selectedAthlete?.completes.push(response);
        },
        error: (error) => {
          this.alertService.show('Erfassung fehlgeschlagen','Bei der Erfassung ist etwas schief gelaufen',"error");
        }
    })
  }

  // Ich bin verloren.
  // Lost and not found.
  // null && !found //.

  submitNewDistance(kilometers: number, meters: number, centimeters: number) {
    let combinedCentimeters = (kilometers! * 100000) + (meters! * 100) + (centimeters! * 1);
    
    let kilometersResult = '';
    let metersResult = '';
    let centimetersResult = '';

    let kilometersForOutput = Math.floor(combinedCentimeters / 100000);
    if(kilometersForOutput < 10) {
      kilometersResult = '00'+kilometersForOutput.toString();
    } else if(kilometersForOutput > 9 && kilometersForOutput < 100) {
      kilometersResult = '0'+kilometersForOutput.toString();
    } else {
      kilometersResult = kilometersForOutput.toString();
    }
    combinedCentimeters %= 100000;

    let metersForOutput = Math.floor(combinedCentimeters / 100);
    if(metersForOutput < 10) {
      metersResult = '00'+metersForOutput.toString();
    } else if(metersForOutput > 9 && metersForOutput < 100) {
      metersResult = '0'+metersForOutput.toString();
    } else {
      metersResult = metersForOutput.toString();
    }
    combinedCentimeters %= 100;

    let centimetersForOutput = Math.floor(combinedCentimeters / 1);
    if(centimetersForOutput < 10) {
      centimetersResult = '0'+centimetersForOutput.toString();
    } else {
      centimetersResult = centimetersForOutput.toString();
    }

    return kilometersResult+':'+metersResult+':'+centimetersResult;
  }

  submitNewTime(hours: number, minutes: number, seconds: number, milliseconds: number) {
    let combinedSeconds = (hours! * 3600) + (minutes! * 60) + (seconds! * 1) + (milliseconds! * 0.001);
    
    let hoursResult = '';
    let minutesResult = '';
    let secondsResult = '';
    let millisecondsResult = '';

    // Stunden
    let hoursForOutput = Math.floor(combinedSeconds / 3600);
    if(hoursForOutput < 10) {
      hoursResult = '0'+hoursForOutput.toString();
    } else {
      hoursResult = hoursForOutput.toString();
    }
    combinedSeconds %= 3600;

    // Minuten
    let minutesForOutput = Math.floor(combinedSeconds / 60);
    if(minutesForOutput < 10) {
      minutesResult = '0'+minutesForOutput.toString();
    } else {
      minutesResult = minutesForOutput.toString();
    }
    combinedSeconds %= 60;

    // Sekunden
    let secondsForOutput = Math.floor(combinedSeconds / 1);
    if(secondsForOutput < 10) {
      secondsResult = '0'+secondsForOutput.toString();
    } else {
      secondsResult = secondsForOutput.toString();
    }
    combinedSeconds %= 1;

    // Millisekunden
    let millisecondsForOutput = Math.floor(combinedSeconds * 1000);
    if(millisecondsForOutput < 10) {
      millisecondsResult = '00'+millisecondsForOutput.toString();
    } else if(millisecondsForOutput > 9 && millisecondsForOutput < 100) {
      millisecondsResult = '0'+millisecondsForOutput.toString();
    } else {
      millisecondsResult = millisecondsForOutput.toString();
    }

    return hoursResult+':'+minutesResult+':'+secondsResult+':'+millisecondsResult;
  }

  ngOnInit(): void {
    if(!this.selectedAthlete) return;
    console.log(this.selectedAthlete.id)
  
    this.categoriesService.getCategoriesByAthleteIdCategoriesGet(this.selectedAthlete.id).subscribe({
      next: (response: ResponseGetCategoriesByAthleteIdCategoriesGet) => {
        this.categories = response;
        console.log(this.categories);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Fetch fehlgeschlagen', 'Die Exercises des Sportlers konnten nicht erfolgreich gefetched werden.', "error");
      }
    });
  }  
}