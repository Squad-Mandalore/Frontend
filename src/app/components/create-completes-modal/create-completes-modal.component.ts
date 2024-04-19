import {NgClass, CommonModule, NgIf, NgSwitch, NgSwitchCase, DatePipe} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {IconComponent} from "../icon/icon.component";
import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {AthleteCompletesResponseSchema, AthleteFullResponseSchema, AthleteResponseSchema, AthletesService, CategoriesService, CategoryFullResponseSchema, CategoryVeryFullResponseSchema, CompletesResponseSchema, CsvService, ResponseParseCsvFileCsvParsePost} from "../../shared/generated";
import {AlertService} from "../../shared/alert.service";
import { SecondaryButtonComponent } from "../buttons/secondary-button/secondary-button.component";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {CompletesPostSchema, CompletesService} from "../../shared/generated";
import { HttpErrorResponse } from "@angular/common/http";
import customFilter from "../../../utils/custom-filter";
import customSort from "../../../utils/custom-sort";

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
    CommonModule,
    DatePipe
  ],
  templateUrl: './create-completes-modal.component.html',
  styleUrl: './create-completes-modal.component.scss'
})

export class CreateCompletesComponent implements OnInit{
  createCompletesForm;
  showPage = 1;
  subPage = 4;
  categories: any[] = [];
  selectedExercise: any = null;
  givenRulesValue: string = '';
  @Input() selectedAthlete!: AthleteFullResponseSchema | null;
  @Input() modals!: any;
  @Input() athletes!: AthleteFullResponseSchema[];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;

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
  }

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private completesService: CompletesService,
    private categoriesService: CategoriesService,
    private csvService: CsvService,
    private athleteService: AthletesService,

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
      quantity: ['', Validators.required],
      medal: ['-', Validators.required],
      goldActive: ['', Validators.required],
      silverActive: ['', Validators.required],
      bronzeActive: ['', Validators.required],
      noneActive: ['', Validators.required],
    })
  }

  changePage(event: Event, newPage: number){
    event.preventDefault();
    if(newPage === 0) this.modals.createCompletesModal.isActive = false;
    if(this.showPage === 1 && newPage === 2 && !this.selectedExercise) return;
    this.showPage = newPage;
  }

  processSubPageToGive(){
    this.givenRulesValue = this.selectedExercise.rules[0].bronze;
    this.switchSubPage(this.givenRulesValue);
  }

  switchSubPage(givenValue: string) {
    if (givenValue.match(/^\d{4}$/)) {
      this.subPage = 1;
    } else if (givenValue.match(/^\d{2}:\d{2}:\d{2}:\d{3}$/)) {
      this.subPage = 2;
    } else if (givenValue.match(/^\d{3}:\d{3}:\d{2}$/)) {
      this.subPage = 3;
    } else {
      this.subPage = 4;
    }
  }

  onSubmit() {
    this.completesData.exercise_id = this.selectedExercise.id;

    if(this.createCompletesForm.value.hours != '' ||  this.createCompletesForm.value.minutes != '' || this.createCompletesForm.value.seconds != ''|| this.createCompletesForm.value.milliseconds != ''){
      const hours = +this.createCompletesForm.value.hours!;
      const minutes = +this.createCompletesForm.value.minutes!;
      const seconds = +this.createCompletesForm.value.seconds!;
      const milliseconds = +this.createCompletesForm.value.milliseconds!;

      this.completesData.result = this.submitNewTime(hours, minutes, seconds, milliseconds);
    } else if(this.createCompletesForm.value.kilometers != '' || this.createCompletesForm.value.meters != '' || this.createCompletesForm.value.centimeters != ''){
      const kilometers = +this.createCompletesForm.value.kilometers!;
      const meters = +this.createCompletesForm.value.meters!;
      const centimeters = +this.createCompletesForm.value.centimeters!;

      this.completesData.result = this.submitNewDistance(kilometers, meters, centimeters);
    } else if (this.createCompletesForm.value.quantity != '') {
      const quantity = +this.createCompletesForm.value.quantity!;

      this.completesData.result = this.submitNewQuantity(quantity);
    } else {
      this.completesData.result = this.createCompletesForm.value.medal!;
    }

    this.completesService.createCompletesCompletesPost(this.completesData).subscribe({
      next: (response: AthleteCompletesResponseSchema) => {
        this.alertService.show('Eintrag erfasst', 'Eintrag wurde erfolgreich hinzugefügt.', 'success');
        this.modals.createCompletesModal.isActive = false;
          if(this.selectedAthlete) this.selectedAthlete?.completes.push(response);
        },
        error: (error) => {
          this.alertService.show('Erfassung fehlgeschlagen','Bei der Erfassung ist etwas schief gelaufen',"error");
        }
    })
  }

  // Ich bin verloren.
  // Lost and not found.
  // null && !found //.

  submitNewDistance(kilometers: number, meters: number, centimeters: number): string {
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

  submitNewTime(hours: number, minutes: number, seconds: number, milliseconds: number): string {
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

  submitNewQuantity(quantity: number): string {
    let quantityResult = '';

    if (quantity < 10) {
      quantityResult = '000'+quantity.toString();
    } else if (quantity < 100) {
      quantityResult = '00'+quantity.toString();
    } else if (quantity < 1000) {
      quantityResult = '0'+quantity.toString();
    } else {
      quantityResult = quantity.toString();
    }

    return quantityResult;
  }

  customSortCall(array: AthleteCompletesResponseSchema[], sortSettings: {property: string, direction: string}){
    return array.sort((a: any, b: any) => customSort(a, b, sortSettings, "athlete"));
  }

  ngOnInit(): void {
    if(!this.selectedAthlete) return;
    this.completesData.athlete_id = this.selectedAthlete.id;

    this.categoriesService.getCategoriesByAthleteIdCategoriesGet(this.selectedAthlete.id).subscribe({
      next: (response: any) => {
        this.categories = response;
        if(!this.selectedAthlete) return;
        for(const category of this.categories){
          for(const exercise of category.exercises){
            const pastExercises = this.customSortCall(customFilter(this.selectedAthlete.completes, {discipline: {filterValue: exercise.title, valueFullFit: true} }, true, "athlete"), {property: 'completed_at', direction: 'desc'});
            const pastExercisesPoints = pastExercises.map(element => element.points);
            exercise.best_result = pastExercisesPoints.length !== 0 ? Math.max(...pastExercisesPoints) : 0;
            exercise.last_tracked_at = pastExercises.length !== 0 ? pastExercises[0].tracked_at : null;
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Fetch fehlgeschlagen', 'Die Exercises des Sportlers konnten nicht erfolgreich gefetched werden.', "error");
      }
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click(); // This will open the file dialog
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
          arr.push(`Key: ${key}, Value: ${value}`);
        });
        let str: string = '';
        for (const strt of arr) {
          str += strt + '\n';
        }
        
        this.athleteService.getAllAthletesAthletesGet().subscribe({
          next: (athletes: AthleteResponseSchema[]) => {
            for(const athlete of athletes){ 
              this.athleteService.getAthleteFullAthletesIdFullGet(athlete.id).subscribe({
                next: (fullAthleteObject: AthleteFullResponseSchema) => {
                  const elementIndex = this.athletes.findIndex(element => element.id === athlete.id);
                  if(elementIndex === -1){
                    this.athletes.push(fullAthleteObject);
                  }else{
                    this.athletes[elementIndex] = fullAthleteObject;
                  }
                },
                error: (error: HttpErrorResponse) => {
                  this.alertService.show('Abfragen der Athleten fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
                }
              })
            }
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.show('Abfragen der Athleten fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
          }
        });

        this.alertService.show('CSV-Daten erfolgreich hinzugefügt', str, 'success');
        this.modals.createCompletesModal.isActive = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Hochladen der CSV-Datei fehlgeschlagen', error.error.detail, 'error');
      },
    })
  }
}
