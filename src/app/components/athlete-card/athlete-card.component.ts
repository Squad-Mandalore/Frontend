import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserCardComponent} from '../user-card/user-card.component';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { AthleteFullResponseSchema } from '../../shared/generated';
import customFilter from '../../../utils/custom-filter';
import { calculateProgressPercent, calculateProgressColor } from '../../../utils/calculate-progress';
import { CompletesResponseSchema } from '../../shared/generated';

@Component({
  selector: 'app-athlete-card',
  standalone: true,
  imports: [UserCardComponent, CommonModule],
  templateUrl: './athlete-card.component.html',
  styleUrl: './athlete-card.component.scss'
})

export class AthleteCardComponent {
  constructor(private route: ActivatedRoute) { }
  routeSubscription!: Subscription;

  @Input() isActive: boolean = false;
  @Input() athlete!: AthleteFullResponseSchema;

  getProgress(completes: CompletesResponseSchema[]){
    return calculateProgressPercent(completes);
  }

  getColorVariable(completes: CompletesResponseSchema[]){
    return calculateProgressColor(completes)
  }

  customFilterCall(array: any[], options: Object, selectionFullFit: boolean){
    return customFilter(array, options, selectionFullFit, "athlete");
  }
}

