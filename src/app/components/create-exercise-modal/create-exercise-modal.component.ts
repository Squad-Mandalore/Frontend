import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {IconComponent} from "../icon/icon.component";
import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {AthleteFullResponseSchema, AthletePostSchema, AthletesService, CategoriesService, CategoryResponseSchema} from "../../shared/generated";
import {LoggerService} from "../../shared/logger.service";
import {AlertService} from "../../shared/alert.service";
import {UtilService} from "../../shared/service-util";
import { SecondaryButtonComponent } from "../buttons/secondary-button/secondary-button.component";
import { Component, Input } from "@angular/core";
import {CompletesPostSchema, CompletesService} from "../../shared/generated";
import { HttpErrorResponse } from "@angular/common/http";


@Component({
  selector: 'app-create-exercise',
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
  templateUrl: './create-exercise-modal.component.html',
  styleUrl: './create-exercise-modal.component.scss'
})

export class CreateExerciseComponent {
  createExerciseForm;
  pageShow = 1;
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

  public exerciseData: CompletesPostSchema = {
    exercise_id: '',
    athlete_id: '',
    tracked_at: '',
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
    this.createExerciseForm = this.formBuilder.group({
      exercise_id: ['', Validators.required],
      athlete_id: ['', Validators.required],
      tracked_at: ['', Validators.required],
      result: ['', Validators.required],
      points: ['', Validators.required],
    })
  }

  onSubmit() {
    const { exercise_id, athlete_id, result } = this.createExerciseForm.value;

    this.exerciseData.exercise_id = exercise_id!;
    this.exerciseData.athlete_id = athlete_id!;
    this.exerciseData.result = result!;

      this.completesService.createCompletesCompletesPost(this.exerciseData).subscribe({
        next: () => {
        this.alertService.show('Eintrag erfasst', 'Eintrag wurde erfolgreich hinzugefügt.', 'success');
        this.modals.createAthleteModal.isActive = false;
        },
        error: (error) => {
            this.alertService.show('Erfassung fehlgeschlagen','Bei der Erfassung ist etwas schief gelaufen',"error");
        }
    })
  }

  submitNewDistance() {
    var combinedCentimeters = (this.distance.kilometers! * 100000) + (this.distance.meters! * 100) + (this.distance.centimeters! * 1);
    
    var kilometersForOutput = Math.floor(combinedCentimeters / 100000);
    combinedCentimeters %= 100000;

    var metersForOutput = Math.floor(combinedCentimeters / 100);
    combinedCentimeters %= 100;

    var centimetersForOutput = Math.floor(combinedCentimeters / 1);
  }

  submitNewTime(){
    var combinedSeconds = (this.time.hours! * 3600) + (this.time.minutes! * 60) + (this.time.seconds! * 1) + (this.time.milliseconds! * 0.001);
    
    var hoursForOuput = Math.floor(combinedSeconds / 3600);
    combinedSeconds %= 3600;

    var minutesForOuput = Math.floor(combinedSeconds / 60);
    combinedSeconds %= 60;

    var secondsForOutput = Math.floor(combinedSeconds / 1);
    combinedSeconds %= 1;

    var millisecondsForOutput = Math.floor(combinedSeconds * 1000);
  }



  fetchExercises(){

    
    if(!this.selectedAthlete) return;
    console.log(this.selectedAthlete.id)
    this.categoriesService.getCategoryCategoriesIdGet(this.selectedAthlete.id).subscribe({
      next: (response: CategoryResponseSchema) => {
          console.log(response);
      },
      error: (error: HttpErrorResponse) => {
          this.alertService.show('Login fehlgeschlagen', 'Benutzername oder Passwort falsch!', "error");
      }
  });
  }
}