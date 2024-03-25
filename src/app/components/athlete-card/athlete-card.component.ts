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
  @Input() athlete!: {
    firstname: string;
    gender: string;
    date_of_birth: string;
    has_swimming_certificate: boolean;
    number_silver_medals: number;
    created_at: string;
    progress_points: number;
    type: string;
    created_by: string;
    last_password_change: string;
    lastname: string;
    number_bronze_medals: number;
    number_gold_medals: number;
    last_edited_at: string;
    progress: number;
    progress_medal: string;
    id: number;
    email: string;
    username: string
  };

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      const routeId = params['id'];
      this.isActive = routeId && routeId == this.athlete.id ? true : false;
    })
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}

