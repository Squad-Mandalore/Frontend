import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarBottomComponent } from '../../components/navbar-bottom/navbar-bottom.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RulePostSchema, RuleResponseSchema, RulesService } from '../../shared/generated';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { PrimaryButtonComponent } from '../../components/buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../components/buttons/secondary-button/secondary-button.component';
import { IconComponent } from '../../components/icon/icon.component';
import customFilter from '../../../utils/custom-filter';
import customSort from '../../../utils/custom-sort';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { AlertService } from '../../shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from '../../shared/confirmation.service';
import { CreateExerciseModalComponent } from '../../components/create-exercise-modal/create-exercise-modal.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-exercise-overview',
  standalone: true,
  imports: [SidebarComponent, ConfirmationModalComponent, CreateExerciseModalComponent, NavbarBottomComponent, NgIf, NgFor, NgClass, UserCardComponent, PrimaryButtonComponent, SecondaryButtonComponent, IconComponent],
  templateUrl: './exercise-overview-page.component.html',
  styleUrl: './exercise-overview-page.component.scss',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        animate('200ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('200ms', style({opacity: 0}))
      ])
    ])
  ]
})

export class ExerciseOverviewComponent implements OnInit, OnDestroy {
  constructor(private alertService: AlertService, private rulesService: RulesService, private confirmationService: ConfirmationService) { }
  exercises: RuleResponseSchema[] = [];
  filter: any = {};
  sorting: {property: string, direction: "asc" | "desc"} = {property: 'category', direction: 'asc'};
  searchValue = "";
  isLoading: boolean = true;
  
  modals = {
    createTrainerModal: {
      isActive: false,
    },
    createAthleteModal: {
      isActive: false,
    },
    createExerciseModal: {
      isActive: false
    }
  }

  deleteExercise(exercise: RuleResponseSchema){
    this.confirmationService.show("Möchtest du die Übung wirklich löschen?", "Dieser Vorgang kann nicht rückgängig gemacht werden.", "Löschen", "Abbrechen", true, ()=>{
      this.rulesService.deleteRuleRulesIdDelete(exercise.id).subscribe({
        next: ()=>{
          this.exercises.filter(element => element.id !== exercise.id);
          this.alertService.show("Löschen erfolgreich", "Die Übung wurde erfolgreich gelöscht", "success");
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.show('Löschen der Übung fehlgeschlagen', 'Bitte versuche es später erneut', "error");
        }
      })
    })
  }

  setSorting(property: string){
    if(this.sorting.property === property){
      this.sorting.direction = this.sorting.direction === "asc" ? "desc" : "asc";
      return
    }

    this.sorting.property = property;
    this.sorting.direction = "desc";
  }

  customSortCall(array: RuleResponseSchema[], sortSettings: {property: string, direction: string}){
    return array.sort((a: any, b: any) => customSort(a, b, sortSettings, "exercise"))
  }

  getActiveFilters(){
    let counter = 0;
    for (const [key, value] of Object.entries(this.filter)){
      if(this.filter[key] && this.filter[key].filterValue) counter++;
    }
    return counter;
  }

  getDisciplines(exercises: RuleResponseSchema[]){
    const trackedDisziplines: string[] = [];
    for(const exercise of exercises){
      if(!trackedDisziplines.find(trainer => trainer === exercise.exercise.title)) trackedDisziplines.push(exercise.exercise.title);
    }
    return trackedDisziplines;
  }

  setFilter(key:string, value:any, valueFullFit: boolean = true){
    if(typeof key === "string"){
      this.filter[key] = {
        filterValue: this.filter[key] && this.filter[key].filterValue == value ? "" : value,
        valueFullFit: valueFullFit,
      }
      return
    }
  }

  customFilterCall(array: any[], options: Object, selectionFullFit: boolean){
    return customFilter(array, options, selectionFullFit, "exercise");
  }

  changeSearchValue(value: string){
    this.searchValue = value;
  }

  createExercise(title: string, category_id: string, from_age: number, to_age: number, bronze_value: string){
    // const schema: RulePostSchema = {
    //   title: title, 

    //   gender: Gender;
    //   from_age: from_age,
    //   to_age: to_age,
    //   bronze: bronze_value,
    //   silver: string;
    //   gold: string;
    //   year: string;
    //   exercise_id: string;
    // };
    // this.rulesService.createRuleRulesPost(schema).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.alertService.show('Erstellen der Übung fehlgeschlagen', 'Bitte versuche es später erneut', "error");
    //   }
    // });
  }

  ngOnInit(): void {
    this.rulesService.getAllRulesRulesGet().subscribe({
      next: (exercises: RuleResponseSchema[]) => {
        this.exercises = exercises;
        console.log(exercises);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Abfragen der Übungen fehlgeschlagen', 'Bitte versuche es später erneut', "error");
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {

  }
}
