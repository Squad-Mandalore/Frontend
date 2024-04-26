import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarBottomComponent } from '../../components/navbar-bottom/navbar-bottom.component';
import { NgClass, NgFor, NgIf, DatePipe } from '@angular/common';

import { UserCardComponent } from '../../components/user-card/user-card.component';
import { PrimaryButtonComponent } from '../../components/buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../components/buttons/secondary-button/secondary-button.component';
import { IconComponent } from '../../components/icon/icon.component';
import { AthleteCompletesResponseSchema, AthletePatchSchema, AthletePostSchema, AthleteResponseSchema, CompletesResponseSchema, CompletesService, CsvService, ResponseParseCsvFileCsvParsePost, TrainersService } from '../../shared/generated';
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
import { FormGroup } from '@angular/forms';
import { LoggerService } from '../../shared/logger.service';
import { CreateAthleteModalComponent } from '../../components/create-athlete-modal/create-athlete-modal.component';
import { FileCallbackData } from '../../shared/file-callback-data';

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
  constructor(
    private route: ActivatedRoute,
    private completesService: CompletesService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private athleteService: AthletesService,
    private alertService: AlertService,
    private logger: LoggerService,
    private csvService: CsvService,
  ) {}

  athletes: AthleteFullResponseSchema[] = []
  searchValue: string = ""
  selectedAthlete?: AthleteFullResponseSchema;
  isLoading: boolean = true;
  filter: any = {};
  routeSubscription!: Subscription;
  sorting: {property: string, direction: "asc" | "desc"} = {property: 'tracked_at', direction: 'desc'};
  dashArray: number = 525;
  modals = {
    createAthleteModal: {
      isActive: false,
      title: "Neuen Sportler hinzufügen",
      primeButtonText: "Sportler anlegen",
    },
    createCompletesModal: {
      isActive: false,
    },
    showDetails: {
      isActive: false,
    },
    patchAthleteModal: {
      isActive: false,
      title: "Sportler bearbeiten",
      primeButtonText: "Speichern",
    },
  }

  patchAthlete(createAthleteForm: FormGroup) {
    // Get date values from the Form
    const day = createAthleteForm.value.day ?? this.selectedAthlete?.birthday?.split('-')[2];
    const month = createAthleteForm.value.month ?? this.selectedAthlete?.birthday?.split('-')[1];
    const year = createAthleteForm.value.year ?? this.selectedAthlete?.birthday?.split('-')[0];

    // Add Data for the Http-Request for the Backend
    let body: AthletePatchSchema = {
      birthday: year + "-" + month.toString().padStart(2,'0') + "-" + day.toString().padStart(2,'0'), // Format Birthday for Backend
      ...createAthleteForm.value
    };
    //delete empty fields, so they wont be overwritten
    Object.keys(body).forEach(key => {
      if(body[key as keyof AthletePatchSchema] === "") {
        delete body[key as keyof AthletePatchSchema];
      }
    });

    // Http-Request for Post of the Athlete to the Backend
    this.athleteService.updateAthleteAthletesIdPatch(this.selectedAthlete!.id , body).subscribe({
      // Post Athlete if allowed
      next: (response: AthleteResponseSchema) => {
        this.alertService.show('Athlet aktualisiert', 'Athlet wurde erfolgreich bearbeitet.', 'success');
        this.modals.patchAthleteModal.isActive = false;
        if(response && response.id){
          this.athleteService.getAthleteFullAthletesIdFullGet(response.id).subscribe({
            // Post Athlete if allowed
            next: (response: AthleteFullResponseSchema) => {
              if(response){
                this.selectedAthlete = response;
                this.athletes = this.athletes.map(element => element.id === response.id ? response : element);

                //console.log(this.athletes)
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
  createAthlete(createAthleteForm: FormGroup) {
    if (createAthleteForm.invalid){
      this.logger.error("Form invalid");
      return;
    }
    // Get date values from the Form
    const day = createAthleteForm.value.day!;
    const month = createAthleteForm.value.month!;
    const year = createAthleteForm.value.year!;

    // Add Data for the Http-Request for the Backend
    const body : AthletePostSchema = {
      birthday: year + "-" + month.toString().padStart(2,'0') + "-" + day.toString().padStart(2,'0'), // Format Birthday for Backend
      ...createAthleteForm.value
    };

    // Http-Request for Post of the Athlete to the Backend
    this.athleteService.createAthleteAthletesPost(body).subscribe({
      // Post Athlete if allowed
      next: (response: AthleteResponseSchema) => {
        this.alertService.show('Athlet erstellt', 'Athlet wurde erfolgreich erstellt.', 'success');
        this.modals.createAthleteModal.isActive = false;
        if(response && response.id){
          this.athleteService.getAthleteFullAthletesIdFullGet(response.id).subscribe({
            // Post Athlete if allowed
            next: (response: AthleteFullResponseSchema) => {
              if(response){
                this.athletes.push(response)
                //console.log(this.athletes)
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

  csvParse(fileCallBackData: FileCallbackData) {
    this.csvService.parseCsvFileCsvParsePost(fileCallBackData.file).subscribe({
      next: (response: ResponseParseCsvFileCsvParsePost) => {
        let arr: string[] = Object.keys(response).map(key => `${key}: ${response[key as keyof typeof response]}`);
        let str: string = arr.join('\n');
        this.gnNoTini();
        this.alertService.show('CSV-Daten erfolgreich hinzugefügt', str, 'success');
        this.modals[fileCallBackData.modalType as keyof typeof this.modals].isActive = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Hochladen der CSV-Datei fehlgeschlagen', error.error.detail, 'error');
      },
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
           this.selectedAthlete = undefined;
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

  gnNoTini(): void {
    this.athletes.length = 0;
    this.athleteService.getAllAthletesAthletesGet().subscribe({
      next: (athletes: AthleteResponseSchema[]) => {
        for(const athlete of athletes){
          this.athleteService.getAthleteFullAthletesIdFullGet(athlete.id).subscribe({
            next: (fullAthleteObject: AthleteFullResponseSchema) => {
              this.athletes.push(fullAthleteObject);
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

  ngOnInit(): void {
    if(this.athletes.length === 0){
      this.gnNoTini();
    }
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const athleteId = params['id'];
      if(athleteId){
        this.selectedAthlete = this.athletes.filter(element => element.id == athleteId)[0];
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
