import { Component, Input } from '@angular/core';
import { CompletesResponseSchema, CompletesService } from '../../../shared/generated';
import { FormBuilder } from '@angular/forms';
import { AlertService } from '../../../shared/alert.service';

@Component({
  selector: 'app-patch-completes-modal',
  standalone: true,
  imports: [],
  templateUrl: './patch-completes-modal.component.html',
  styleUrl: './patch-completes-modal.component.scss'
})
export class PatchCompletesModalComponent {
  completesForm;
  @Input({required: true}) selectedCompletes!: CompletesResponseSchema;
  @Input({required: true}) modal: any;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private completesService: CompletesService,
  ){
    this.completesForm = this.formBuilder.group({
      exercise_id: [''],
      result: [''],
      quantity: [''],
    })
  }
  onSubmit() {
    if (this.completesForm.value.quantity != '') {
      const quantity = +this.completesForm.value.quantity!;
      this.completesForm.patchValue({result: this.submitNewQuantity(quantity)});
    }

    this.completesService.updateCompletesCompletesPatch(this.selectedCompletes.exercise.id, this.selectedCompletes.athlete_id, this.selectedCompletes.tracked_at, {result: this.completesForm.value.result!}).subscribe({
      next: (response: CompletesResponseSchema) => {
        this.alertService.show('Eintrag erfasst', 'Eintrag wurde erfolgreich hinzugefügt.', 'success');
        this.modal.isActive = false;
        this.selectedCompletes = response;
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
}
