import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TrainerResponseSchema } from '../../shared/generated';

@Component({
  selector: 'app-trainer-card',
  standalone: true,
  imports: [],
  templateUrl: './trainer-card.component.html',
  styleUrl: './trainer-card.component.scss'
})
export class TrainerCardComponent {
  constructor(private route: ActivatedRoute) { }
  routeSubscription!: Subscription;

  isActive: boolean = false;
  @Input() trainer!: TrainerResponseSchema;

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const routeId = params['id'];
      this.isActive = !!(routeId && routeId == this.trainer.id);
    })
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
