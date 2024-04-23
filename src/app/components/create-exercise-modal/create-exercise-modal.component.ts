import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/alert.service';
import { UtilService } from '../../shared/service-util';
import { CategoriesService, CategoryResponseSchema, ExercisePostSchema, ExerciseResponseSchema, ExercisesService, RulePostSchema, RuleResponseSchema, RulesService } from '../../shared/generated';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../buttons/secondary-button/secondary-button.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { IconComponent } from '../icon/icon.component'
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';

@Component({
  selector: 'app-create-exercise-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, NgClass, NgFor, NgIf, IconComponent, ReactiveFormsModule],
  templateUrl: './create-exercise-modal.component.html',
  styleUrl: './create-exercise-modal.component.scss'
})
export class CreateExerciseModalComponent implements OnInit {
  @Input() modals!: any;
  @Input() exercises!: RuleResponseSchema[];
  categories: any[] = [];
  exerciseForm;
  useExistingExercise: boolean = false;
  masks = ['Anzahl', 'Zeit', 'Distanz', 'Medaille'];
  page = 1;
  subPage = 1;
  selectedExercise: any = null;
  validation = {
    invalidTitle: false,
  }

  constructor(private categoriesService: CategoriesService, private rulesService: RulesService, private formBuilder: FormBuilder, private alertService: AlertService, private utilService: UtilService, private exerciseService: ExercisesService){
    this.exerciseForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: ['Ausdauer', Validators.required],
      fromAge: [1, [Validators.required, utilService.passwordValidator()]],
      toAge: [99, Validators.required],
      gender: ['m', Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      mask: ['Anzahl', Validators.required],


      goldPoints: ['0', Validators.required],
      silverPoints: ['0', Validators.required],
      bronzePoints: ['0', Validators.required],

      goldHours: ['', Validators.required],
      silverHours: ['', Validators.required],
      bronzeHours: ['', Validators.required],

      goldMinutes: ['', Validators.required],
      silverMinutes: ['', Validators.required],
      bronzeMinutes: ['', Validators.required],

      goldSeconds: ['', Validators.required],
      silverSeconds: ['', Validators.required],
      bronzeSeconds: ['', Validators.required],

      goldMilliseconds: ['', Validators.required],
      silverMilliseconds: ['', Validators.required],
      bronzeMilliseconds: ['', Validators.required],

      goldKilometers: ['', Validators.required],
      silverKilometers: ['', Validators.required],
      bronzeKilometers: ['', Validators.required],

      goldMeters: ['', Validators.required],
      silverMeters: ['', Validators.required],
      bronzeMeters: ['', Validators.required],

      goldCentimeters: ['', Validators.required],
      silverCentimeters: ['', Validators.required],
      bronzeCentimeters: ['', Validators.required],

      goldQuantity: ['', Validators.required],
      silverQuantity: ['', Validators.required],
      bronzeQuantity: ['', Validators.required],
    });
  }

  validateInput(inputType: string, mode: 'activate' | 'deactivate'){
    if(inputType = 'title'){
      if(this.exerciseForm.value.title?.length === 0){
        if(mode === 'activate'){
          this.validation.invalidTitle = true;
        } else {
          this.validation.invalidTitle = false;
        }
      } 
    }
  }

  switchSubPage(givenValue: string) {
    if (givenValue.match(/^\d{4}$/)) {
      this.subPage = 1;
    } else if (givenValue.match(/^\d{2}:\d{2}:\d{2}:\d{3}$/)) {
      this.subPage = 2;
    } else if (givenValue.match(/^\d{3}:\d{3}:\d{2}$/)) {
      this.subPage = 3;
    }
  }

  returnMask(value: any){
    if(value === "Anzahl") return "0000";
    if(value === "Zeit") return "00:00:00:000";
    if(value === "Distanz") return "000:000:00";
    return "";
  }

  changePage(event: Event, targetPage: number){
    event.preventDefault();

    if(targetPage === 0) this.modals.createCompletesModal.isActive = false;
    if(this.page === 1 && targetPage === 2){
      if(this.useExistingExercise && !this.selectedExercise || !this.useExistingExercise && !this.exerciseForm.value.title){
        this.validateInput('title', 'activate');
        return;
      }
      this.switchSubPage(this.selectedExercise?.rules[0]?.bronze ?? this.returnMask(this.exerciseForm.value.mask));
    }
    this.page = targetPage;
  }

  // gender: Gender;
  // from_age: number;
  // to_age: number;
  // bronze: string;
  // silver: string;
  // gold: string;
  // year: string;
  // exercise_id: string;

  // title: string;
  // category_id: string;

  submitNewTime(hours: number, minutes: number, seconds: number, milliseconds: number): string {
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds + (milliseconds * 0.001);

    let hoursResult = Math.floor(totalSeconds / 3600);
    let minutesResult = Math.floor((totalSeconds % 3600) / 60);
    let secondsResult = Math.floor(totalSeconds % 60);
    let millisecondsResult = Math.floor((totalSeconds % 1) * 1000);

    const formatWithLeadingZero = (value: number): string => {
      return value < 10 ? '0' + value : value.toString();
    };

    return `${formatWithLeadingZero(hoursResult)}:${formatWithLeadingZero(minutesResult)}:${formatWithLeadingZero(secondsResult)}:${millisecondsResult.toString().padStart(3, '0')}`;
  }

  submitNewDistance(kilometers: number, meters: number, centimeters: number): string {
    let combinedCentimeters = (kilometers * 100000) + (meters * 100) + centimeters;

    const kilometersResult = Math.floor(combinedCentimeters / 100000);
    combinedCentimeters %= 100000;

    const metersResult = Math.floor(combinedCentimeters / 100);
    combinedCentimeters %= 100;

    const centimetersResult = Math.floor(combinedCentimeters);

    const formatWithLeadingZero = (value: number): string => {
      return value < 10 ? '0' + value : value.toString();
    };

    return `${formatWithLeadingZero(kilometersResult)}:${formatWithLeadingZero(metersResult)}:${formatWithLeadingZero(centimetersResult)}`;
  }


  submitNewQuantity(quantity: number): string {
    return quantity.toString().padStart(4, '0');
  }

  onSubmit(){
  
    const exerciseBody: ExercisePostSchema = {
      title: this.exerciseForm.value.title!,
      category_id: this.categories[this.categories.findIndex(element => element.title === this.exerciseForm.value.category)].id,
    }

    const ruleBody: RulePostSchema = {
      from_age: this.exerciseForm.value.fromAge!,
      to_age: this.exerciseForm.value.toAge!,
      exercise_id: '',
      gold: '',
      silver: '',
      bronze: '',
      gender: this.exerciseForm.value.gender! === "m" ? 'm' : 'f',
      year: this.exerciseForm.value.year!.toString(),
    };

    console.log(ruleBody, exerciseBody);

    if(this.useExistingExercise){
      ruleBody.exercise_id = this.selectedExercise.id;
    }else{
      this.exerciseService.createExerciseExercisesPost(exerciseBody).subscribe({
        next: (exercise: ExerciseResponseSchema) => {
          ruleBody.exercise_id = exercise.id;
        },
        error: (error) => {
          this.alertService.show('Exercise Erstellung fehlgeschlagen','Bitte versuche es später erneut',"error");
        }
      });
    }

    if(this.exerciseForm.value.goldHours && this.exerciseForm.value.silverHours && this.exerciseForm.value.bronzeHours &&  this.exerciseForm.value.goldMinutes && this.exerciseForm.value.silverMinutes && this.exerciseForm.value.bronzeMinutes && this.exerciseForm.value.goldSeconds && this.exerciseForm.value.silverSeconds && this.exerciseForm.value.bronzeSeconds && this.exerciseForm.value.goldMilliseconds && this.exerciseForm.value.silverMilliseconds && this.exerciseForm.value.bronzeMilliseconds){
      
      ruleBody.gold = this.submitNewTime(parseInt(this.exerciseForm.value.goldHours), parseInt(this.exerciseForm.value.goldMinutes), parseInt(this.exerciseForm.value.goldSeconds), parseInt(this.exerciseForm.value.goldMilliseconds));
      ruleBody.silver = this.submitNewTime(parseInt(this.exerciseForm.value.silverHours), parseInt(this.exerciseForm.value.silverMinutes), parseInt(this.exerciseForm.value.silverSeconds), parseInt(this.exerciseForm.value.silverMilliseconds));
      ruleBody.bronze = this.submitNewTime(parseInt(this.exerciseForm.value.bronzeHours), parseInt(this.exerciseForm.value.bronzeMinutes), parseInt(this.exerciseForm.value.bronzeSeconds), parseInt(this.exerciseForm.value.bronzeMilliseconds));
    
    } else if(this.exerciseForm.value.goldKilometers && this.exerciseForm.value.silverKilometers && this.exerciseForm.value.bronzeKilometers && this.exerciseForm.value.goldMeters && this.exerciseForm.value.silverMeters && this.exerciseForm.value.bronzeMeters && this.exerciseForm.value.goldCentimeters && this.exerciseForm.value.silverCentimeters && this.exerciseForm.value.bronzeCentimeters){

      ruleBody.gold = this.submitNewDistance(parseInt(this.exerciseForm.value.goldKilometers), parseInt(this.exerciseForm.value.goldMeters), parseInt(this.exerciseForm.value.goldCentimeters));
      ruleBody.silver = this.submitNewDistance(parseInt(this.exerciseForm.value.silverKilometers), parseInt(this.exerciseForm.value.silverMeters), parseInt(this.exerciseForm.value.silverCentimeters));
      ruleBody.bronze = this.submitNewDistance(parseInt(this.exerciseForm.value.bronzeKilometers), parseInt(this.exerciseForm.value.bronzeMeters), parseInt(this.exerciseForm.value.bronzeCentimeters));
    
    } else if (this.exerciseForm.value.goldQuantity && this.exerciseForm.value.silverQuantity && this.exerciseForm.value.bronzeQuantity) {
      
      ruleBody.gold = this.submitNewQuantity(parseInt(this.exerciseForm.value.goldQuantity));
      ruleBody.silver = this.submitNewQuantity(parseInt(this.exerciseForm.value.silverQuantity));
      ruleBody.bronze = this.submitNewQuantity(parseInt(this.exerciseForm.value.bronzeQuantity));

    }

    this.rulesService.createRuleRulesPost(ruleBody).subscribe({
      next: (rule: RuleResponseSchema) => {
        console.log(rule);
        this.alertService.show('Erstellung erfolgreich','Du kannst die neue Übung jetzt verwenden',"error");
        this.exercises.push(rule);
        this.modals.createExerciseModal.isActive = false;
      },
      error: (error) => {
        this.alertService.show('Rule Erstellung fehlgeschlagen','Bitte versuche es später erneut',"error");
      }
    });
  }

  ngOnInit(): void {
    this.categoriesService.getCategoriesByAthleteIdCategoriesGet().subscribe({
      next: (response: any) => {
        if(response.length !== 0){
          this.categories = response;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Fetch fehlgeschlagen', 'Die Exercises des Sportlers konnten nicht erfolgreich gefetched werden.', "error");
      }
    });
  }
}
