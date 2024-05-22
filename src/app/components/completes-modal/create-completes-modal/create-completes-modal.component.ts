import {NgClass, CommonModule, NgIf, NgSwitch, NgSwitchCase, DatePipe} from "@angular/common";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { TimeinputComponent } from "../timeinput/timeinput.component";
import { DistanceinputComponent } from "../distanceinput/distanceinput.component";
import { AthleteCompletesResponseSchema, AthleteFullResponseSchema, CategoriesService, CompletesPostSchema, CompletesService } from "../../../shared/generated";
import { IconComponent } from "../../icon/icon.component";
import { PrimaryButtonComponent } from "../../buttons/primary-button/primary-button.component";
import { SecondaryButtonComponent } from "../../buttons/secondary-button/secondary-button.component";
import { PasswordBoxComponent } from "../../password-box/password-box.component";
import { AlertComponent } from "../../alert/alert.component";
import { AlertService } from "../../../shared/alert.service";
import customSort from "../../../../utils/custom-sort";
import customFilter from "../../../../utils/custom-filter";

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
    DatePipe,
    TimeinputComponent,
    DistanceinputComponent,
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
  selectedCategory: any = null;
  givenRulesValue: string = '';
  @Input({required: true}) selectedAthlete!: AthleteFullResponseSchema;
  @Input({required: true}) modal: any;
  @Output() fileCallback = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile?: File;

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
  ){
    this.createCompletesForm = this.formBuilder.group({
      exercise_id: ['', Validators.required],
      result: ['', Validators.required],
      quantity: [''],
    })
  }

  changePage(event: Event, newPage: number){
    event.preventDefault();
    if(newPage === 0) this.modal.isActive = false;
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
      this.createCompletesForm.patchValue({result: "00:00:00:000"});
      this.subPage = 2;
    } else if (givenValue.match(/^\d{3}:\d{3}:\d{2}$/)) {
      this.createCompletesForm.patchValue({result: "000:000:00"});
      this.subPage = 3;
    } else {
      this.createCompletesForm.patchValue({result: "0"});
      this.subPage = 4;
    }
  }

  onSubmit() {
    if (this.createCompletesForm.value.quantity != '') {
      const quantity = +this.createCompletesForm.value.quantity!;

      this.createCompletesForm.patchValue({result: this.submitNewQuantity(quantity)});
    }

    if(!this.createCompletesForm.valid) {
      return;
    }

    this.completesService.createCompletesCompletesPost({exercise_id: this.createCompletesForm.value.exercise_id!, athlete_id: this.selectedAthlete.id, result: this.createCompletesForm.value.result!}).subscribe({
      next: (response: AthleteCompletesResponseSchema) => {
        this.alertService.show('Eintrag erfasst', 'Eintrag wurde erfolgreich hinzugefügt.', 'success');
        this.modal.isActive = false;
          if(this.selectedAthlete) this.selectedAthlete?.completes.push(response);
        },
        error: (error) => {
          this.alertService.show('Erfassung fehlgeschlagen','Bei der Erfassung ist etwas schief gelaufen',"error");
        }
    })
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
    this.fileCallback.emit(this.selectedFile);
  }

}
