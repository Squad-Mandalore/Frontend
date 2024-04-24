import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/alert.service';
import { UtilService } from '../../shared/service-util';
import { CategoriesService, ExercisePostSchema, ExerciseResponseSchema, ExercisesService, RulePostSchema, RuleResponseSchema, RulesService } from '../../shared/generated';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../buttons/secondary-button/secondary-button.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { IconComponent } from '../icon/icon.component'
import { HttpErrorResponse } from '@angular/common/http';
import { from } from 'rxjs';

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
  selectedGender: 'm'|'f' = "m";
  selectedMask = 'Anzahl';
  selectedCategory = "Ausdauer";
  page = 1;
  subPage = 1;
  selectedExercise: any = null;
  validation: ValidationSchema = {
    invalidTitle: false,
    titleAlreadyExists: false,
    ruleAlreadyExists: false,
    nonsenseAge: false,
    emptyAge: false
  };
  alreadySubmittedOnce: boolean =false;

  constructor(private categoriesService: CategoriesService, private rulesService: RulesService, private formBuilder: FormBuilder, private alertService: AlertService, private utilService: UtilService, private exerciseService: ExercisesService){
    this.exerciseForm = this.formBuilder.group({
      title: ['', Validators.required],
      fromAge: [1, [Validators.required, utilService.passwordValidator()]],
      toAge: [99, Validators.required],
      year: [new Date().getFullYear(), Validators.required],

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
  
  activateValidation(key: keyof ValidationSchema){
    this.validation[key] = true;
  }

  deactivateValidation(key: keyof ValidationSchema){
    this.validation[key] = false;
  }

  validateInput(inputType: string){
    if(inputType === 'title'){
      if(this.exerciseForm.value.title?.length === 0){
        this.activateValidation('invalidTitle');
        return;
      }else{
        this.deactivateValidation('titleAlreadyExists');
      }

      if(this.checkIfExerciseAlreadyExists().length !== 0){
        this.activateValidation('titleAlreadyExists');
        return;
      }else{
        this.deactivateValidation('titleAlreadyExists');
      }
    }

    if(inputType === 'age'){

      if(!this.exerciseForm.value.toAge || !this.exerciseForm.value.fromAge){
        this.activateValidation('emptyAge');
        return;
      }else{
        this.deactivateValidation('emptyAge');
      }

      if(this.exerciseForm.value.toAge < this.exerciseForm.value.fromAge){
        this.activateValidation('nonsenseAge');
        return;
      }else{
        this.deactivateValidation('nonsenseAge');
      }
    }

    if(inputType === 'rule'){
      if(this.doesRuleAlreadyExist()){
        this.activateValidation('ruleAlreadyExists');
        return;
      }else{
        this.deactivateValidation('ruleAlreadyExists');
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

  checkIfExerciseAlreadyExists(){
    return this.categories.filter(category => {
      if(category.title === this.selectedCategory){
        for(const exercise of category.exercises){
          if(exercise.title === this.exerciseForm.value.title){
            return exercise;
          }
        }
      }
    })
  }

  doesRuleAlreadyExist(){
    const fromAge = this.exerciseForm.value.fromAge ?? 0;
    const toAge = this.exerciseForm.value.toAge ?? 99;
    const gender = this.selectedGender;
    const matchedExerciseTitle = this.useExistingExercise && this.selectedExercise ? this.selectedExercise.title : this.exerciseForm.value.title; 

    const result = this.exercises.filter(rule => {
      if(
        rule.exercise.category.title === this.selectedCategory &&
        rule.exercise.title === matchedExerciseTitle &&
        rule.gender === gender && (
          rule.to_age >= fromAge && rule.to_age <= toAge ||
          rule.from_age >= fromAge && rule.from_age <= toAge ||
          rule.from_age <= fromAge && rule.to_age >= toAge ||
          rule.from_age >= fromAge && rule.to_age <= toAge ||
          rule.from_age === fromAge && rule.to_age === toAge
        )
      ) return rule;
      return;
    })

    if(result.length > 0) return true;
    return false;
  }

  changePage(event: Event, targetPage: number){
    event.preventDefault();

    if(targetPage === 0) this.modals.createCompletesModal.isActive = false;
    if(this.page === 1 && targetPage === 2){
      if(this.useExistingExercise && !this.selectedExercise || !this.useExistingExercise && !this.exerciseForm.value.title){
        this.validateInput('title');
        return;
      }

      if(!this.useExistingExercise){
        const equallyNamedExercises = this.checkIfExerciseAlreadyExists();
        if(equallyNamedExercises.length !== 0){
          this.validateInput('title');
          return;
        }
      }
      
      this.switchSubPage(this.selectedExercise?.rules[0]?.bronze ?? this.returnMask(this.selectedMask));
    }

    if(this.page === 2 && targetPage === 3){
      if(!this.exerciseForm.value.fromAge || !this.exerciseForm.value.toAge){
        this.activateValidation('nonsenseAge')
        return
      }
      if(this.exerciseForm.value.fromAge! > this.exerciseForm.value.toAge!){
        this.activateValidation('nonsenseAge')
        return
      }
      if(this.doesRuleAlreadyExist()){
        this.activateValidation('ruleAlreadyExists')
        return;
      }
    }

    this.page = targetPage;
  }

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
    let combinedCentimeters = (kilometers! * 100000) + (meters! * 100) + (centimeters! * 1);

    let kilometersResult = Math.floor(combinedCentimeters / 100000).toString().padStart(3, '0');
    combinedCentimeters %= 100000;

    let metersResult = Math.floor(combinedCentimeters / 100).toString().padStart(3, '0');
    combinedCentimeters %= 100;

    let centimetersResult = Math.floor(combinedCentimeters / 1).toString().padStart(2, '0');

    return kilometersResult+':'+metersResult+':'+centimetersResult;
  }

  submitNewQuantity(quantity: number): string {
    return quantity.toString().padStart(4, '0');
  }

  onSubmit(){
  
    const exerciseBody: ExercisePostSchema = {
      title: this.useExistingExercise ? this.selectedExercise.title : this.exerciseForm.value.title!,
      category_id: this.categories[this.categories.findIndex(element => element.title === this.selectedCategory)].id,
    }

    const ruleBody: RulePostSchema = {
      from_age: this.exerciseForm.value.fromAge!,
      to_age: this.exerciseForm.value.toAge!,
      exercise_id: '',
      gold: '',
      silver: '',
      bronze: '',
      gender: this.selectedGender! === "m" ? 'm' : 'f',
      year: this.exerciseForm.value.year!.toString()+"-01-01",
    };

    let promise = new Promise((resolve, reject)=>{

      if(this.useExistingExercise){
        ruleBody.exercise_id = this.selectedExercise.id;
        resolve("fullFilled");
      }else{
        const equallyNamedExercises = this.checkIfExerciseAlreadyExists();
        if (equallyNamedExercises.length !== 0){
          ruleBody.exercise_id = equallyNamedExercises[0].id;
          resolve("fullFilled");
        }else{
          this.exerciseService.createExerciseExercisesPost(exerciseBody).subscribe({
            next: (exercise: ExerciseResponseSchema) => {
              ruleBody.exercise_id = exercise.id;
              resolve("fullFilled");
            },
            error: (error) => {
              this.alertService.show('Exercise Erstellung fehlgeschlagen','Bitte versuche es später erneut',"error");
              reject();
            }
          });
        }
      }
    })

    promise.then(()=>{
      const mask = this.selectedExercise?.rules[0]?.bronze ?? this.returnMask(this.selectedMask);
      if(mask.match(/^\d{2}:\d{2}:\d{2}:\d{3}$/)){

        const goldHours = this.exerciseForm.value.goldHours ? +this.exerciseForm.value.goldHours : 0;
        const goldMinutes = this.exerciseForm.value.goldMinutes ? +this.exerciseForm.value.goldMinutes : 0;
        const goldSeconds = this.exerciseForm.value.goldSeconds ? +this.exerciseForm.value.goldSeconds : 0;
        const goldMilliseconds = this.exerciseForm.value.goldMilliseconds ? +this.exerciseForm.value.goldMilliseconds : 0;

        const silverHours = this.exerciseForm.value.silverHours ? +this.exerciseForm.value.silverHours : 0;
        const silverMinutes = this.exerciseForm.value.silverMinutes ? +this.exerciseForm.value.silverMinutes : 0;
        const silverSeconds = this.exerciseForm.value.silverSeconds ? +this.exerciseForm.value.silverSeconds : 0;
        const silverMilliseconds = this.exerciseForm.value.silverMilliseconds ? +this.exerciseForm.value.silverMilliseconds : 0;

        const bronzeHours = this.exerciseForm.value.bronzeHours ? +this.exerciseForm.value.bronzeHours : 0;
        const bronzeMinutes = this.exerciseForm.value.bronzeMinutes ? +this.exerciseForm.value.bronzeMinutes : 0;
        const bronzeSeconds = this.exerciseForm.value.bronzeSeconds ? +this.exerciseForm.value.bronzeSeconds : 0;
        const bronzeMilliseconds = this.exerciseForm.value.bronzeMilliseconds ? +this.exerciseForm.value.bronzeMilliseconds : 0;
        
        ruleBody.gold = this.submitNewTime(goldHours, goldMinutes, goldSeconds, goldMilliseconds);
        ruleBody.silver = this.submitNewTime(silverHours, silverMinutes, silverSeconds, silverMilliseconds);
        ruleBody.bronze = this.submitNewTime(bronzeHours, bronzeMinutes, bronzeSeconds, bronzeMilliseconds);
      
      } else if(mask.match(/^\d{3}:\d{3}:\d{2}$/)){
        
        const goldKilometers = this.exerciseForm.value.goldKilometers ? +this.exerciseForm.value.goldKilometers : 0;
        const goldMeters = this.exerciseForm.value.goldMeters ? +this.exerciseForm.value.goldMeters : 0;
        const goldCentimeters = this.exerciseForm.value.goldCentimeters ? +this.exerciseForm.value.goldCentimeters : 0;

        const silverKilometers = this.exerciseForm.value.silverKilometers ? +this.exerciseForm.value.silverKilometers : 0;
        const silverMeters = this.exerciseForm.value.silverMeters ? +this.exerciseForm.value.silverMeters : 0;
        const silverCentimeters = this.exerciseForm.value.silverCentimeters ? +this.exerciseForm.value.silverCentimeters : 0;

        const bronzeKilometers = this.exerciseForm.value.bronzeKilometers ? +this.exerciseForm.value.bronzeKilometers : 0;
        const bronzeMeters = this.exerciseForm.value.bronzeMeters ? +this.exerciseForm.value.bronzeMeters : 0;
        const bronzeCentimeters = this.exerciseForm.value.bronzeCentimeters ? +this.exerciseForm.value.bronzeCentimeters : 0;

        ruleBody.gold =  this.submitNewDistance(goldKilometers, goldMeters, goldCentimeters);
        ruleBody.silver = this.submitNewDistance(silverKilometers, silverMeters, silverCentimeters);
        ruleBody.bronze = this.submitNewDistance(bronzeKilometers, bronzeMeters, bronzeCentimeters);
      
      } else if (mask.match(/^\d{4}$/)) {
        
        const goldQuantity = this.exerciseForm.value.goldQuantity ? +this.exerciseForm.value.goldQuantity : 0;
        const silverQuantity = this.exerciseForm.value.silverQuantity ? +this.exerciseForm.value.silverQuantity : 0;
        const bronzeQuantity = this.exerciseForm.value.bronzeQuantity ? +this.exerciseForm.value.bronzeQuantity : 0;

        ruleBody.gold = this.submitNewQuantity(goldQuantity);
        ruleBody.silver = this.submitNewQuantity(silverQuantity);
        ruleBody.bronze = this.submitNewQuantity(bronzeQuantity);

      } else {
        ruleBody.gold = 'Gold';
        ruleBody.silver = 'Silber';
        ruleBody.bronze = 'Bronze';
      }

      this.rulesService.createRuleRulesPost(ruleBody).subscribe({
        next: (rule: RuleResponseSchema) => {
          this.alertService.show('Erstellung erfolgreich','Du kannst die neue Übung jetzt verwenden',"success");
          this.exercises.push(rule);
          this.modals.createExerciseModal.isActive = false;
        },
        error: (error) => {
          this.alertService.show('Rule Erstellung fehlgeschlagen','Bitte versuche es später erneut',"error");
        }
      });
    })
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


interface ValidationSchema {
  invalidTitle: boolean,
  titleAlreadyExists: boolean,
  ruleAlreadyExists: boolean,
  nonsenseAge: boolean,
  emptyAge: boolean
}