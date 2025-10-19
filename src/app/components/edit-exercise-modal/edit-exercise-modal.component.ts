import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/alert.service';
import { UtilService } from '../../shared/service-util';
import { RuleResponseSchema, RulePostSchema, RulesService } from '../../shared/generated';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../buttons/secondary-button/secondary-button.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-exercise-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, NgClass, NgFor, NgIf, IconComponent, ReactiveFormsModule],
  templateUrl: './edit-exercise-modal.component.html',
  styleUrls: ['./edit-exercise-modal.component.scss']
})
export class EditExerciseModalComponent implements OnInit {
  @Input() exercise!: RuleResponseSchema;
  @Input() modals!: any;
  @Input() exercises!: RuleResponseSchema[];
  @Output() updateComplete = new EventEmitter<void>();
  exerciseForm;
  masks = ['Anzahl', 'Zeit', 'Distanz', 'Medaille'];
  selectedMask = 'Anzahl';
  subPage = 1;

  constructor(
    private rulesService: RulesService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private utilService: UtilService
  ) {
    this.exerciseForm = this.formBuilder.group({
      goldQuantity: ['', Validators.required],
      silverQuantity: ['', Validators.required],
      bronzeQuantity: ['', Validators.required],

      goldHours: ['', Validators.required],
      silverHours: ['', Validators.required],
      bronzeHours: ['', Validators.required],

      goldMinutes: ['', Validators.required],
      silverMinutes: ['', Validators.required],
      bronzeMinutes: ['', Validators.required],

      goldSeconds: ['', Validators.required],
      silverSeconds: ['', Validators.required],
      bronzeSeconds: ['', Validators.required],

      goldMilliseconds: ['', Validators.required],
      silverMilliseconds: ['', Validators.required],
      bronzeMilliseconds: ['', Validators.required],

      goldKilometers: ['', Validators.required],
      silverKilometers: ['', Validators.required],
      bronzeKilometers: ['', Validators.required],

      goldMeters: ['', Validators.required],
      silverMeters: ['', Validators.required],
      bronzeMeters: ['', Validators.required],

      goldCentimeters: ['', Validators.required],
      silverCentimeters: ['', Validators.required],
      bronzeCentimeters: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.exercise) {
      const mask = this.determineMask(this.exercise.gold);
      this.selectedMask = mask;
      this.subPage = this.getSubPageForMask(mask);

      this.exerciseForm.patchValue({
        goldQuantity: mask === 'Anzahl' ? this.exercise.gold : '',
        silverQuantity: mask === 'Anzahl' ? this.exercise.silver : '',
        bronzeQuantity: mask === 'Anzahl' ? this.exercise.bronze : '',

        goldHours: mask === 'Zeit' ? this.extractTime(this.exercise.gold, 'hours') : '',
        silverHours: mask === 'Zeit' ? this.extractTime(this.exercise.silver, 'hours') : '',
        bronzeHours: mask === 'Zeit' ? this.extractTime(this.exercise.bronze, 'hours') : '',

        goldMinutes: mask === 'Zeit' ? this.extractTime(this.exercise.gold, 'minutes') : '',
        silverMinutes: mask === 'Zeit' ? this.extractTime(this.exercise.silver, 'minutes') : '',
        bronzeMinutes: mask === 'Zeit' ? this.extractTime(this.exercise.bronze, 'minutes') : '',

        goldSeconds: mask === 'Zeit' ? this.extractTime(this.exercise.gold, 'seconds') : '',
        silverSeconds: mask === 'Zeit' ? this.extractTime(this.exercise.silver, 'seconds') : '',
        bronzeSeconds: mask === 'Zeit' ? this.extractTime(this.exercise.bronze, 'seconds') : '',

        goldMilliseconds: mask === 'Zeit' ? this.extractTime(this.exercise.gold, 'milliseconds') : '',
        silverMilliseconds: mask === 'Zeit' ? this.extractTime(this.exercise.silver, 'milliseconds') : '',
        bronzeMilliseconds: mask === 'Zeit' ? this.extractTime(this.exercise.bronze, 'milliseconds') : '',

        goldKilometers: mask === 'Distanz' ? this.extractDistance(this.exercise.gold, 'kilometers') : '',
        silverKilometers: mask === 'Distanz' ? this.extractDistance(this.exercise.silver, 'kilometers') : '',
        bronzeKilometers: mask === 'Distanz' ? this.extractDistance(this.exercise.bronze, 'kilometers') : '',

        goldMeters: mask === 'Distanz' ? this.extractDistance(this.exercise.gold, 'meters') : '',
        silverMeters: mask === 'Distanz' ? this.extractDistance(this.exercise.silver, 'meters') : '',
        bronzeMeters: mask === 'Distanz' ? this.extractDistance(this.exercise.bronze, 'meters') : '',

        goldCentimeters: mask === 'Distanz' ? this.extractDistance(this.exercise.gold, 'centimeters') : '',
        silverCentimeters: mask === 'Distanz' ? this.extractDistance(this.exercise.silver, 'centimeters') : '',
        bronzeCentimeters: mask === 'Distanz' ? this.extractDistance(this.exercise.bronze, 'centimeters') : '',
      });
    }
    else {
      this.alertService.show('Fehler', 'Die Übung konnte nicht geladen werden.', 'error');
      this.modals.editExerciseModal.isActive = false;
    }
  }

  determineMask(value: string): string {
    if (value.match(/^\d{4}$/)) {
      return 'Anzahl';
    } else if (value.match(/^\d{2}:\d{2}:\d{2}:\d{3}$/)) {
      return 'Zeit';
    } else if (value.match(/^\d{3}:\d{3}:\d{2}$/)) {
      return 'Distanz';
    }
    return 'Medaille';
  }

  extractTime(value: string, unit: string): string {
    const parts = value.split(':');
    switch (unit) {
      case 'hours':
        return parts[0];
      case 'minutes':
        return parts[1];
      case 'seconds':
        return parts[2];
      case 'milliseconds':
        return parts[3];
      default:
        return '';
    }
  }

  extractDistance(value: string, unit: string): string {
    const parts = value.split(':');
    switch (unit) {
      case 'kilometers':
        return parts[0];
      case 'meters':
        return parts[1];
      case 'centimeters':
        return parts[2];
      default:
        return '';
    }
  }

  getSubPageForMask(mask: string): number {
    if (mask === 'Anzahl') return 1;
    if (mask === 'Zeit') return 2;
    if (mask === 'Distanz') return 3;
    return 1; // default to 'Anzahl'
  }

  submitNewTime(hours: number, minutes: number, seconds: number, milliseconds: number): string {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds + (milliseconds * 0.001);

    const hoursResult = Math.floor(totalSeconds / 3600);
    const minutesResult = Math.floor((totalSeconds % 3600) / 60);
    const secondsResult = Math.floor(totalSeconds % 60);
    const millisecondsResult = Math.floor((totalSeconds % 1) * 1000);

    const formatWithLeadingZero = (value: number): string => {
      return value < 10 ? '0' + value : value.toString();
    };

    return `${formatWithLeadingZero(hoursResult)}:${formatWithLeadingZero(minutesResult)}:${formatWithLeadingZero(secondsResult)}:${millisecondsResult.toString().padStart(3, '0')}`;
  }

  submitNewDistance(kilometers: number, meters: number, centimeters: number): string {
    let combinedCentimeters = (kilometers! * 100000) + (meters! * 100) + (centimeters! * 1);

    const kilometersResult = Math.floor(combinedCentimeters / 100000).toString().padStart(3, '0');
    combinedCentimeters %= 100000;

    const metersResult = Math.floor(combinedCentimeters / 100).toString().padStart(3, '0');
    combinedCentimeters %= 100;

    const centimetersResult = Math.floor(combinedCentimeters / 1).toString().padStart(2, '0');

    return kilometersResult + ':' + metersResult + ':' + centimetersResult;
  }

  submitNewQuantity(quantity: number): string {
    return quantity.toString().padStart(4, '0');
  }

  onSubmit() {
    const ruleBody: RulePostSchema = {
      from_age: this.exercise.from_age,
      to_age: this.exercise.to_age,
      exercise_id: this.exercise.exercise.id,
      gold: '',
      silver: '',
      bronze: '',
      gender: this.exercise.gender,
      year: this.exercise.year,
    };

    const mask = this.determineMask(this.exercise.gold);
    if (mask === 'Zeit') {
      const goldHours = this.exerciseForm.value.goldHours ? +this.exerciseForm.value.goldHours : 0;
      const goldMinutes = this.exerciseForm.value.goldMinutes ? +this.exerciseForm.value.goldMinutes : 0;
      const goldSeconds = this.exerciseForm.value.goldSeconds ? +this.exerciseForm.value.goldSeconds : 0;
      const goldMilliseconds = this.exerciseForm.value.goldMilliseconds ? +this.exerciseForm.value.goldMilliseconds : 0;

      const silverHours = this.exerciseForm.value.silverHours ? +this.exerciseForm.value.silverHours : 0;
      const silverMinutes = this.exerciseForm.value.silverMinutes ? +this.exerciseForm.value.silverMinutes : 0;
      const silverSeconds = this.exerciseForm.value.silverSeconds ? +this.exerciseForm.value.silverSeconds : 0;
      const silverMilliseconds = this.exerciseForm.value.silverMilliseconds ? +this.exerciseForm.value.silverMilliseconds : 0;

      const bronzeHours = this.exerciseForm.value.bronzeHours ? +this.exerciseForm.value.bronzeHours : 0;
      const bronzeMinutes = this.exerciseForm.value.bronzeMinutes ? +this.exerciseForm.value.bronzeMinutes : 0;
      const bronzeSeconds = this.exerciseForm.value.bronzeSeconds ? +this.exerciseForm.value.bronzeSeconds : 0;
      const bronzeMilliseconds = this.exerciseForm.value.bronzeMilliseconds ? +this.exerciseForm.value.bronzeMilliseconds : 0;

      ruleBody.gold = this.submitNewTime(goldHours, goldMinutes, goldSeconds, goldMilliseconds);
      ruleBody.silver = this.submitNewTime(silverHours, silverMinutes, silverSeconds, silverMilliseconds);
      ruleBody.bronze = this.submitNewTime(bronzeHours, bronzeMinutes, bronzeSeconds, bronzeMilliseconds);

    } else if (mask === 'Distanz') {
      const goldKilometers = this.exerciseForm.value.goldKilometers ? +this.exerciseForm.value.goldKilometers : 0;
      const goldMeters = this.exerciseForm.value.goldMeters ? +this.exerciseForm.value.goldMeters : 0;
      const goldCentimeters = this.exerciseForm.value.goldCentimeters ? +this.exerciseForm.value.goldCentimeters : 0;

      const silverKilometers = this.exerciseForm.value.silverKilometers ? +this.exerciseForm.value.silverKilometers : 0;
      const silverMeters = this.exerciseForm.value.silverMeters ? +this.exerciseForm.value.silverMeters : 0;
      const silverCentimeters = this.exerciseForm.value.silverCentimeters ? +this.exerciseForm.value.silverCentimeters : 0;

      const bronzeKilometers = this.exerciseForm.value.bronzeKilometers ? +this.exerciseForm.value.bronzeKilometers : 0;
      const bronzeMeters = this.exerciseForm.value.bronzeMeters ? +this.exerciseForm.value.bronzeMeters : 0;
      const bronzeCentimeters = this.exerciseForm.value.bronzeCentimeters ? +this.exerciseForm.value.bronzeCentimeters : 0;

      ruleBody.gold = this.submitNewDistance(goldKilometers, goldMeters, goldCentimeters);
      ruleBody.silver = this.submitNewDistance(silverKilometers, silverMeters, silverCentimeters);
      ruleBody.bronze = this.submitNewDistance(bronzeKilometers, bronzeMeters, bronzeCentimeters);

    } else if (mask === 'Anzahl') {
      const goldQuantity = this.exerciseForm.value.goldQuantity ? +this.exerciseForm.value.goldQuantity : 0;
      const silverQuantity = this.exerciseForm.value.silverQuantity ? +this.exerciseForm.value.silverQuantity : 0;
      const bronzeQuantity = this.exerciseForm.value.bronzeQuantity ? +this.exerciseForm.value.bronzeQuantity : 0;

      ruleBody.gold = this.submitNewQuantity(goldQuantity);
      ruleBody.silver = this.submitNewQuantity(silverQuantity);
      ruleBody.bronze = this.submitNewQuantity(bronzeQuantity);

    } else {
      ruleBody.gold = 'Gold';
      ruleBody.silver = 'Silber';
      ruleBody.bronze = 'Bronze';
    }

    this.rulesService.updateRuleRulesIdPatch(this.exercise.id, ruleBody).subscribe({
      next: (rule: RuleResponseSchema) => {
        this.alertService.show('Bearbeitung erfolgreich', 'Die Übung wurde erfolgreich bearbeitet.', "success");
        this.updateComplete.emit();
        this.modals.editExerciseModal.isActive = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Bearbeitung fehlgeschlagen', 'Bitte versuche es später erneut', "error");
      }
    });
  }
}

interface ValidationSchema {
  invalidTitle: boolean,
  titleAlreadyExists: boolean,
  ruleAlreadyExists: boolean,
  nonsenseAge: boolean,
  emptyAge: boolean
}
