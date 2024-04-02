import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarBottomComponent } from '../../components/navbar-bottom/navbar-bottom.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ExerciseResponseSchema, ExercisesService } from '../../shared/generated';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { PrimaryButtonComponent } from '../../components/buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../components/buttons/secondary-button/secondary-button.component';
import { IconComponent } from '../../components/icon/icon.component';
import customFilter from '../../../utils/custom-filter';
import customSort from '../../../utils/custom-sort';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { AlertService } from '../../shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-exercise-overview',
  standalone: true,
  imports: [SidebarComponent, ConfirmationModalComponent, NavbarBottomComponent, NgIf, NgFor, NgClass, UserCardComponent, PrimaryButtonComponent, SecondaryButtonComponent, IconComponent],
  templateUrl: './exercise-overview-page.component.html',
  styleUrl: './exercise-overview-page.component.scss'
})

export class ExerciseOverviewComponent implements OnInit, OnDestroy {
  constructor(private alertService: AlertService, private exerciseService: ExercisesService) { }
  exercises: ExerciseResponseSchema[] = []
  filter: any = {};
  sorting: {property: string, direction: "asc" | "desc"} = {property: 'category', direction: 'asc'};
  searchValue = "";
  
  modals = {
    createTrainerModal: {
      isActive: false,
    },
    createAthleteModal: {
      isActive: false,
    },
    confirmationModal: {
      isActive: false,
      modalTitle: "Benutzer wirklich löschen?",
      modalDescription: "Mit dieser Aktion wird der ausgewählte Benutzer unwiderruflich gelöscht.",
      primaryButtonText: "Benutzer löschen",
      secondaryButtonText: "Abbrechen",
    }
  }

  setSorting(property: string){
    if(this.sorting.property === property){
      this.sorting.direction = this.sorting.direction === "asc" ? "desc" : "asc";
      return
    }

    this.sorting.property = property;
    this.sorting.direction = "desc";
  }

  customSortCall(array: ExerciseResponseSchema[], sortSettings: {property: string, direction: string}){
    return array.sort((a: any, b: any) => customSort(a, b, sortSettings, "exercise"))
  }

  getActiveFilters(){
    let counter = 0;
    for (const [key, value] of Object.entries(this.filter)){
      if(this.filter[key] && this.filter[key].filterValue) counter++;
    }
    return counter;
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

  ngOnInit(): void {
    this.exerciseService.getAllExercisesExercisesAllGet().subscribe({
      next: (exercises: ExerciseResponseSchema[]) => {
        this.exercises = exercises;
        console.log(exercises);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Abfragen der Übungen fehlgeschlagen', 'Bitte versuche es später erneut', "error");
      }
    });
  }

  ngOnDestroy(): void {

  }
}
