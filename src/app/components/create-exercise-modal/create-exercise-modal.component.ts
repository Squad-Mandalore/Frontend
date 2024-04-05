import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/alert.service';
import { UtilService } from '../../shared/service-util';
import { ExercisePostSchema, ExercisesService } from '../../shared/generated';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../buttons/secondary-button/secondary-button.component';
import { NgClass } from '@angular/common';
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-create-exercise-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, NgClass, IconComponent, ReactiveFormsModule],
  templateUrl: './create-exercise-modal.component.html',
  styleUrl: './create-exercise-modal.component.scss'
})
export class CreateExerciseModalComponent {
  @Input() modals!: any;

  exerciseForm;
  category = "Kraft";
  constructor(private formBuilder: FormBuilder, private alertService: AlertService, private utilService: UtilService, private exerciseService: ExercisesService){
    this.exerciseForm = this.formBuilder.group({
      title: ['', Validators.required],
      fromAge: [1, [Validators.required, utilService.passwordValidator()]],
      toAge: [99, Validators.required]
    });
  }

  onSubmit(){
    let body: ExercisePostSchema = {
      title: this.exerciseForm.value.title!,
      from_age: this.exerciseForm.value.fromAge!,
      to_age: this.exerciseForm.value.toAge!,
      category_id: this.category
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
}
