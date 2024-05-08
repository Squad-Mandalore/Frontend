import { Component, Input, OnInit } from '@angular/core';
import { CompletesResponseSchema, CompletesService } from '../../../shared/generated';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../../shared/alert.service';
import { PrimaryButtonComponent } from '../../buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../buttons/secondary-button/secondary-button.component';
import { CommonModule } from '@angular/common';
import { DistanceinputComponent } from '../distanceinput/distanceinput.component';
import { TimeinputComponent } from '../timeinput/timeinput.component';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-patch-completes',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, CommonModule, DistanceinputComponent, TimeinputComponent, IconComponent, ReactiveFormsModule],
  templateUrl: './patch-completes-modal.component.html',
  styleUrl: './patch-completes-modal.component.scss'
})
export class PatchCompletesComponent implements OnInit {
  completesForm;
  subPage = 1;
  @Input({ required: true }) selectedCompletes!: CompletesResponseSchema;
  @Input({ required: true }) modal: any;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private completesService: CompletesService,
  ) {
    this.completesForm = this.formBuilder.group({
      exercise_id: [''],
      result: [''],
      quantity: [''],
    })
  }
  ngOnInit(): void {
    console.log(this.selectedCompletes);
    this.switchSubPage(this.selectedCompletes.result);
  }

  switchSubPage(givenValue: string) {
    if (givenValue.match(/^\d{4}$/)) {
      this.completesForm.patchValue({ quantity: givenValue });
      this.subPage = 1;
    } else if (givenValue.match(/^\d{2}:\d{2}:\d{2}:\d{3}$/)) {
      this.subPage = 2;
    } else if (givenValue.match(/^\d{3}:\d{3}:\d{2}$/)) {
      this.subPage = 3;
    } else {
      this.subPage = 4;
    }
    this.completesForm.patchValue({ result: givenValue });
  }

  onSubmit() {
    if (this.completesForm.value.quantity != '') {
      const quantity = +this.completesForm.value.quantity!;
      this.completesForm.patchValue({ result: this.submitNewQuantity(quantity) });
    }

    this.completesService.updateCompletesCompletesPatch(this.selectedCompletes.exercise.id, this.selectedCompletes.athlete_id, this.selectedCompletes.tracked_at, { result: this.completesForm.value.result! }).subscribe({
      next: (response: CompletesResponseSchema) => {
        this.alertService.show('Eintrag erfasst', 'Eintrag wurde erfolgreich hinzugefügt.', 'success');
        this.modal.isActive = false;
        this.selectedCompletes.result = response.result;
        this.selectedCompletes.points = response.points;
      },
      error: (error) => {
        this.alertService.show('Erfassung fehlgeschlagen', 'Bei der Erfassung ist etwas schief gelaufen', "error");
      }
    })
  }

  submitNewQuantity(quantity: number): string {
    let quantityResult = '';

    if (quantity < 10) {
      quantityResult = '000' + quantity.toString();
    } else if (quantity < 100) {
      quantityResult = '00' + quantity.toString();
    } else if (quantity < 1000) {
      quantityResult = '0' + quantity.toString();
    } else {
      quantityResult = quantity.toString();
    }

    return quantityResult;
  }
}
