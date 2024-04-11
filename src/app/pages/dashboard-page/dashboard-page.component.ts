import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarBottomComponent } from '../../components/navbar-bottom/navbar-bottom.component';
import { NgClass, NgFor, NgIf, DatePipe } from '@angular/common';

import { UserCardComponent } from '../../components/user-card/user-card.component';
import { PrimaryButtonComponent } from '../../components/buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../components/buttons/secondary-button/secondary-button.component';
import { IconComponent } from '../../components/icon/icon.component';
import { AthleteCompletesResponseSchema, AthleteResponseSchema, CompletesResponseSchema, CompletesService, TrainersService } from '../../shared/generated';
import { Subscription } from 'rxjs';
import customSort from '../../../utils/custom-sort';
import customFilter from '../../../utils/custom-filter';
import { calculateProgress, calculateProgressPercent } from '../../../utils/calculate-progress';
import { calculateProgressColor } from '../../../utils/calculate-progress';
import { ConfirmationService } from '../../shared/confirmation.service';
import { AthleteFullResponseSchema } from '../../shared/generated';
import { AthletesService } from '../../shared/generated';
import { AlertService } from '../../shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateCompletesComponent } from '../../components/create-completes-modal/create-completes-modal.component';
import { enterLeaveAnimation } from '../../shared/animation';
import { CreateAthleteModalComponent } from '../../components/create-athlete-modal/create-athlete-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, DatePipe, NavbarBottomComponent, NgIf, NgFor, NgClass, UserCardComponent, PrimaryButtonComponent, SecondaryButtonComponent, IconComponent, CreateCompletesComponent, CreateAthleteModalComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  animations: [
    enterLeaveAnimation
  ]
})

export class DashboardPageComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private completesService: CompletesService, private confirmationService: ConfirmationService, private router: Router, private athleteService: AthletesService, private alertService: AlertService, private trainerService: TrainersService) { }
  athletes: AthleteFullResponseSchema[] = []
  searchValue: string = ""
  selectedAthlete: AthleteFullResponseSchema | null = null;
  isLoading: boolean = true;
  filter: any = {};
  routeSubscription!: Subscription;
  sorting: {property: string, direction: "asc" | "desc"} = {property: 'tracked_at', direction: 'desc'};
  dashArray: number = 525;
  modals = {
    createTrainerModal: {
      isActive: false,
    },
    createAthleteModal: {
      isActive: false,
    },
    createCompletesModal: {
      isActive: false,
    },
    showDetails: {
      isActive: false,
    },
  }


  setSorting(property: string){
    if(this.sorting.property === property){
      this.sorting.direction = this.sorting.direction === "asc" ? "desc" : "asc";
      return
    }

    this.sorting.property = property;
    this.sorting.direction = "desc";
  }

  customSortCall(array: AthleteCompletesResponseSchema[], sortSettings: {property: string, direction: string}){
    return array.sort((a: any, b: any) => customSort(a, b, sortSettings, "athlete"));
  }

  deleteAthlete(athlete: AthleteFullResponseSchema | null){
    this.confirmationService.show(
      'Benutzer wirklich löschen?',
      'Mit dieser Aktion wird der ausgewählte Benutzer unwiderruflich gelöscht.',
      'Benutzer löschen',
      'Abbrechen',
      true,
      () => {
        if(!athlete) return;
        this.athleteService.deleteAhtleteAthletesIdDelete(athlete.id).subscribe({
          next: () => {
           this.alertService.show('Athlet erfolgreich gelöscht', 'Der Athlet wurde erfolgreich entfernt', "success");
           this.athletes = this.athletes.filter(element => element.id !== athlete.id);
           this.selectedAthlete = null;
           this.modals.showDetails.isActive = false;
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.show('Löschen fehlgeschlagen', 'Bitte probiere es später erneut', "error");
          }
        })
      }
    );
  }

  deleteCompletedExercise(completes: CompletesResponseSchema){
    if(!completes || !this.selectedAthlete) return;
    this.confirmationService.show(
      'Leistung wirklich löschen?',
      'Mit dieser Aktion wird die ausgewählte Leistung unwiderruflich gelöscht.',
      'Leistung löschen',
      'Abbrechen',
      true,
      () => {
        this.completesService.deleteAhtleteCompletesDelete(completes.exercise.id, this.selectedAthlete!.id, completes.tracked_at).subscribe({
          next: () => {
            this.alertService.show('Übung erfolgreich gelöscht', 'Die Übung wurde erfolgreich entfernt', "success");
            if(this.selectedAthlete?.completes){
              this.selectedAthlete.completes = this.selectedAthlete?.completes.filter(element => !(element.exercise.id === completes.exercise.id && element.tracked_at === completes.tracked_at));
            }
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.show('Löschen fehlgeschlagen', 'Bitte probiere es später erneut', "error");
          }
        })
      }
    )
  }
  
  calculateCategoryMedal(category: string, completes: CompletesResponseSchema[]){
    if(completes.length === 0) return 'none';
    const numberGoldMedals = this.customFilterCall(completes, {category: {filterValue: category, valueFullFit: true}, points: {filterValue: '3', valueFullFit: true} }, true).length;
    const numberSilverMedals = this.customFilterCall(completes, {category: {filterValue: category, valueFullFit: true}, points: {filterValue: '2', valueFullFit: true} }, true).length;
    const numberBronzeMedals = this.customFilterCall(completes, {category: {filterValue: category, valueFullFit: true}, points: {filterValue: '1', valueFullFit: true} }, true).length;
    if(numberGoldMedals) return 'gold';
    if(numberSilverMedals) return 'silver';
    if(numberBronzeMedals) return 'bronze';
    return 'none';
  }

  getActiveFilters(){
    let counter = 0;
    for (const [key, value] of Object.entries(this.filter)){
      if(this.filter[key] && this.filter[key].filterValue) counter++;
    }
    return counter;
  }

  getTrackingDates(completes: AthleteCompletesResponseSchema[]){
    const trackingDates : string[] = [];
    for(const result of completes){
      if(!trackingDates.find(date => date === result.tracked_at)) trackingDates.push(result.tracked_at.toString());
    }
    return trackingDates;
  }

  getTrackingTrainers(completes: AthleteCompletesResponseSchema[]){
    const trackingTrainers: string[] = [];
    for(const result of completes){
      if(!trackingTrainers.find(trainer => trainer === result.trainer.firstname + ' ' + result.trainer.lastname)) trackingTrainers.push(result.trainer.firstname + ' ' + result.trainer.lastname);
    }
    return trackingTrainers;
  }

  setFilter(key:string, value:any, valueFullFit: boolean = true){
    this.filter[key] = {
      filterValue: this.filter[key] && this.filter[key].filterValue == value ? "" : value,
      valueFullFit: valueFullFit,
    }
  }

  customFilterCall(array: any[], options: Object, selectionFullFit: boolean){
    return customFilter(array, options, selectionFullFit, "athlete");
  }

  getProgress(completes: AthleteCompletesResponseSchema[]){
    return calculateProgress(completes);
  }

  getColorVariable(completes: AthleteCompletesResponseSchema[]){
    return calculateProgressColor(completes)
  }

  dashOffset(athlete: AthleteFullResponseSchema): number {
    const progressDecimal = calculateProgressPercent(athlete.completes) / 100;
    return this.dashArray * (1 - progressDecimal);
  }

  ngOnInit(): void {
    if(this.athletes.length === 0){
      this.athleteService.getAllAthletesAthletesGet().subscribe({
        next: (athletes: AthleteResponseSchema[]) => {
          for(const athlete of athletes){
            this.athleteService.getAthleteFullAthletesIdFullGet(athlete.id).subscribe({
              next: (fullAthleteObject: AthleteFullResponseSchema) => {
                this.athletes.push(fullAthleteObject);
                console.log(fullAthleteObject);
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.show('Abfragen der Athleten fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
              }
            })
          }
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.show('Abfragen der Athleten fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
          this.isLoading = false;
        }
      });
    }

//     this.athletes.push(
//       {
//         id: "1",
//         username: 'test1',
//         email: 'test1@example.com',
//         firstname: 'John',
//         lastname: 'Doe',
//         created_at: '2024-02-26',
//         gender: "m",
//         last_password_change: '2024-02-26',
//         last_edited_at: '2024-02-26',
//         birthday: '2003-02-26',
//         type: 'Sportler',
//         certificates: [],
//         trainer: {
//           id: "1",
//           username: "john_doe",
//           email: "john@example.com",
//           firstname: "John",
//           lastname: "Doe",
//           created_at: "2023-01-01",
//           last_password_change: "2023-05-01",
//           last_edited_at: "2023-10-01",
//           type: "Trainer",
//         },
//         completes: [
//           {
//             athlete_id: "1",
//             exercise: {
//               id: "1",
//               title: "50 Meter Sprint",
//               category: {
//                 id: "1",
//                 title: "Schnelligkeit",
//               },
//               from_age: 1,
//               to_age: 9,
//               rules: [],
//             },
//             tracked_by: "Kay Schulz",
//             tracked_at: "12.10.2023",
//             result: "10s",
//             points: 3
//           },
//           {
//             athlete_id: "2",
//             exercise: {
//               id: "2",
//               title: "Long Jump",
//               category: {
//                 id: "1",
//                 title: "Schnelligkeit",
//               },
//               from_age: 10,
//               to_age: 15,
//               rules: []
//             },
//             tracked_by: "Lisa Müller",
//             tracked_at: "14.10.2023",
//             result: "4.2m",
//             points: 2,
//           },
//           {
//             athlete_id: "3",
//             exercise: {
//               id: "3",
//               title: "High Jump",
//               category: {
//                 id: "2",
//                 title: "Koordination",
//               },
//               from_age: 16,
//               to_age: 20,
//               rules: []
//             },
//             tracked_by: "Max Mustermann",
//             tracked_at: "16.10.2023",
//             result: "1.9m",
//             points: 1,
//           },
//           {
//             athlete_id: "4",
//             exercise: {
//               id: "4",
//               title: "100 Meter Sprint",
//               category: {
//                 id: "1",
//                 title: "Schnelligkeit",
//               },
//               from_age: 21,
//               to_age: 30,
//               rules: []
//             },
//             tracked_by: "Emma Schmidt",
//             tracked_at: "18.10.2023",
//             result: "11s",
//             points: 2
//           },
//           {
//             athlete_id: "5",
//             exercise: {
//               id: "5",
//               title: "Shot Put",
//               category: {
//                 id: "3",
//                 title: "Kraft",
//               },
//               from_age: 31,
//               to_age: 40,
//               rules: []
//             },
//             tracked_by: "Sophie Fischer",
//             tracked_at: "20.10.2023",
//             result: "14.5m",
//             points: 1,
//           }
//         ]
//       }
//     )

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const athleteId = params['id'];
      if(athleteId){
        this.selectedAthlete = this.athletes.filter(element => element.id == athleteId)[0] ?? null
        if(!this.selectedAthlete){
          this.router.navigate(['/athleten']);
        }
      }
    })
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
