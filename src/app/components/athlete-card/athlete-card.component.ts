import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserCardComponent} from '../user-card/user-card.component';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { AthleteFullResponseSchema } from '../../shared/generated';
import customFilter from '../../../utils/custom-filter';
import { calculateProgressPercent, calculateProgressColor } from '../../../utils/calculate-progress';
import { AthleteCompletesResponseSchema } from '../../shared/generated';

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

  isActive: boolean = false;
  @Input() athlete!: AthleteFullResponseSchema;

  getProgress(completes: AthleteCompletesResponseSchema[]){
    return calculateProgressPercent(completes);
  }

  getColorVariable(completes: AthleteCompletesResponseSchema[]){
    return calculateProgressColor(completes)
  }

  customFilterCall(array: any[], options: Object, selectionFullFit: boolean){
    return customFilter(array, options, selectionFullFit, "athlete");
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const routeId = params['id'];
      this.isActive = !!(routeId && routeId == this.athlete.id);
    })
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}

