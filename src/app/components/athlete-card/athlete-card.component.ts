import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Athlete from '../../models/athlete';

@Component({
  selector: 'app-athlete-card',
  standalone: true,
  imports: [UserCardComponent, CommonModule],
  templateUrl: './athlete-card.component.html',
  styleUrl: './athlete-card.component.scss'
})

export class AthleteCardComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private router: Router) { }
  routeSubscription!: Subscription;

  isActive: boolean = false;
  @Input() athlete!: Athlete;

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
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

