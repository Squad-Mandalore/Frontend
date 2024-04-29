import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {NavbarBottomComponent} from '../../components/navbar-bottom/navbar-bottom.component';
import {DatePipe, NgClass, NgFor, NgIf} from '@angular/common';

import { UserCardComponent } from '../../components/user-card/user-card.component';
import { PrimaryButtonComponent } from '../../components/buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../components/buttons/secondary-button/secondary-button.component';
import { IconComponent } from '../../components/icon/icon.component';
import {
  AthleteCompletesResponseSchema,
  AthletePatchSchema,
  AthletePostSchema,
  AthleteResponseSchema, CertificateResponseSchema, CertificateSingleResponseSchema,
  CertificatesService,
  CompletesResponseSchema,
  CompletesService,
  CsvService,
  ResponseParseCsvFileCsvParsePost,
  TrainersService
} from '../../shared/generated';
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
import {TertiaryButtonComponent} from "../../components/buttons/tertiary-button/tertiary-button.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, DatePipe, NavbarBottomComponent, NgIf, NgFor, NgClass, UserCardComponent, PrimaryButtonComponent, SecondaryButtonComponent, IconComponent, CreateCompletesComponent, CreateAthleteModalComponent, TertiaryButtonComponent],
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
    private certificateService: CertificatesService
  ) {}

  athletes: AthleteFullResponseSchema[] = []
  searchValue: string = ""
  selectedFile: File | undefined;
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

  csvParse(file: File) {
    this.csvService.parseCsvFileCsvParsePost(file).subscribe({
      next: (response: ResponseParseCsvFileCsvParsePost) => {
        let arr: string[] = Object.keys(response).map(key => `${key}: ${response[key as keyof typeof response]}`);
        let str: string = arr.join('\n');
        this.gnNoTini();
        this.alertService.show('CSV-Daten erfolgreich hinzugefügt', str, 'success');
        // important because you havent typed modals properly
        this.modals.showDetails.isActive = false;
        this.modals.patchAthleteModal.isActive = false;
        this.modals.createAthleteModal.isActive = false;
        this.modals.createCompletesModal.isActive = false;
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
    return calculateProgressColor(completes);
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
              if (this.selectedAthlete?.id === fullAthleteObject.id) {
                this.selectedAthlete = fullAthleteObject;
              }
              this.athletes.push(fullAthleteObject);
            },
            error: (error: HttpErrorResponse) => {
              this.alertService.show('Abfragen der Athleten fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
            }
          })
        }
        // this.selectedAthlete = tempAthlete;
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

  async onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Uploaded file:', this.selectedFile);

    // Read file content
    const fileContent = await this.readFileContent(this.selectedFile!);

    if (fileContent instanceof Blob) {

      // Send the body object to the backend
      this.certificateService.createCertificateCertificatesPost(fileContent, this.selectedAthlete?.id! , this.selectedAthlete?.username!+ "-Schwimmnachweis" ).subscribe({
        next: (response: CertificateResponseSchema) => {
          this.alertService.show('Zertifikat hochgeladen', 'Zertifikat wurde erfolgreich erstellt.', 'success');
          this.selectedAthlete?.certificates.push(response)
          console.log(response);
        },
        error: (error) => {
          if (error.status == 422) {
            this.alertService.show('Erstellung fehlgeschlagen', 'Zertifikat nicht erlaubt', "error");
          } else {
            this.alertService.show('Erstellung fehlgeschlagen', 'Bitte versuche es später erneut', "error");
          }
        }
      });
    } else {
      console.error('Error reading file content');
      // Handle error - file content couldn't be read
    }
  }

  // Trigger download and request to the backend
  onClickDownloadCertificate() {
    if (this.selectedAthlete?.certificates.length! > 0) {
      this.certificateService.getCertificatesCertificatesIdGet(this.selectedAthlete?.certificates[0].id!).subscribe({
        next: (response: CertificateSingleResponseSchema) => {
          this.base64ToPdf(response.blob, response.title)
          this.alertService.show('Zertifikat download', 'Zertifikat Download gestartet', 'success');
        }
      })
    }
  }

  // Trigger deletion of the selected athlete-certificate
  onClickDeleteCertificate() {
    if (this.selectedAthlete?.certificates.length! > 0) {
      this.certificateService.deleteCertificateCertificatesIdDelete(this.selectedAthlete?.certificates[0].id!).subscribe({
        next: () => {
          this.selectedAthlete?.certificates.splice(0, this.selectedAthlete?.certificates.length)
          this.alertService.show('Zertifikat gelöscht', 'Zertifikat wurde erfolgreich gelöscht.', 'success');
        },
        error: (error) => {
          this.alertService.show('Erstellung fehlgeschlagen', 'Bitte versuche es später erneut', "error");
        }
      })
    }
  }

  // This Method is necessary to parse the base64 string of the backend Response to a downloadable pdf
  base64ToPdf(base64String: string, fileName: string): void {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create URL for Blob Object
    const url = window.URL.createObjectURL(blob);

    // Create hidden Link which triggers download of the file
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    a.click();

    // Release the URL-Object
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Create Upload und parse uploaded File to a Blob which can be processed
  async readFileContent(file: File): Promise<Blob | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          // Successfully read file content
          const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });
          resolve(blob);
        } else {
          // Failed to read file content
          resolve(null);
        }
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsArrayBuffer(file);
    });
  }


  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
