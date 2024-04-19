import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/alert.service';
import { UtilService } from '../../shared/service-util';
import { CategoriesService, CategoryResponseSchema, ExercisePostSchema, ExercisesService, RulePostSchema } from '../../shared/generated';
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
  categories: any[] = [];
  exerciseForm;
  useExistingExercise: boolean = false;
  category = "Kraft";
  masks = ['Anzahl', 'Zeit', 'Distanz', 'Medaille'];
  page = 1;
  selectedExercise: any = null;

  constructor(private categoriesService: CategoriesService, private formBuilder: FormBuilder, private alertService: AlertService, private utilService: UtilService, private exerciseService: ExercisesService){
    this.exerciseForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      fromAge: [1, [Validators.required, utilService.passwordValidator()]],
      toAge: [99, Validators.required],
      gender: ['m', Validators.required],
      year: ['', Validators.required],
      mask: ['Anzahl', Validators.required],
      gold: ['Anzahl', Validators.required],
      silver: ['Anzahl', Validators.required],
      bronze: ['Anzahl', Validators.required],
    });
  }

  changePage(event: Event, newPage: number){
    event.preventDefault();
    if(newPage === 0) this.modals.createCompletesModal.isActive = false;
    if(this.page === 1 && newPage === 2 && !this.selectedExercise) return;
    this.page = newPage;
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
  
  onSubmit(){
    let body: ExercisePostSchema | RulePostSchema = {
      title: this.exerciseForm.value.title!,
      from_age: this.exerciseForm.value.fromAge!,
      to_age: this.exerciseForm.value.toAge!,
      category_id: this.category

       // create exercise and then use exercise id in response to create rule
    };
    console.log(body);
    // this.exerciseService.createExerciseExercisesPost(body).subscribe({
    //   next: () => {
    //     this.alertService.show('Übung erstellt', 'Übung wurde erfolgreich erstellt.', 'success');
    //     this.modals.createExerciseModal.isActive = false;
    //   },
    //   error: (error) => {
    //     this.alertService.show('Erstellung fehlgeschlagen','Bitte versuche es später erneut',"error");
    //   }
    // });
  }

  ngOnInit(): void {
    this.categoriesService.getCategoriesByAthleteIdCategoriesGet().subscribe({
      next: (response: any) => {
        if(response.length !== 0){
          console.log(response);
          this.categories = response;
          this.exerciseForm.value.category = response[0].id;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Fetch fehlgeschlagen', 'Die Exercises des Sportlers konnten nicht erfolgreich gefetched werden.', "error");
      }
    });
  }
}
