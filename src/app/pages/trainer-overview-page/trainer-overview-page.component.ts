import { Component } from '@angular/core';
import { TrainerResponseSchema, TrainersService } from '../../shared/generated';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from '../../shared/confirmation.service';
import { AlertService } from '../../shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PrimaryButtonComponent } from '../../components/buttons/primary-button/primary-button.component';
import { NavbarBottomComponent } from '../../components/navbar-bottom/navbar-bottom.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { DatePipe, NgIf } from '@angular/common';
import { CreateTrainerModalComponent } from '../../components/create-trainer-modal/create-trainer-modal.component';
import { enterLeaveAnimation } from '../../shared/animation';

@Component({
  selector: 'app-trainer-overview-page',
  standalone: true,
  imports: [PrimaryButtonComponent, NavbarBottomComponent, SidebarComponent, UserCardComponent, DatePipe, NgIf, CreateTrainerModalComponent],
  templateUrl: './trainer-overview-page.component.html',
  styleUrl: './trainer-overview-page.component.scss',
  animations: [
    enterLeaveAnimation
  ]
})

export class TrainerOverviewPageComponent {
  constructor(private route: ActivatedRoute, private confirmationService: ConfirmationService, private router: Router, private trainerService: TrainersService, private alertService: AlertService) { }
  trainer: TrainerResponseSchema[] = []
  selectedTrainer: TrainerResponseSchema | null = null;
  isLoading: boolean = true;
  routeSubscription!: Subscription;
  modals = {
    createTrainerModal: {
      isActive: false,
    },
    createAthleteModal: {
      isActive: false,
    },
    showDetails: {
      isActive: false,
    },
  }

  deleteTrainer(trainer: TrainerResponseSchema | null){
    this.confirmationService.show(
      'Benutzer wirklich löschen?', 
      'Mit dieser Aktion wird der ausgewählte Benutzer unwiderruflich gelöscht.', 
      'Benutzer löschen', 
      'Abbrechen',
      true,
      () => {
        if(!trainer) return;
        this.trainerService.deleteTrainerTrainersIdDelete(trainer.id).subscribe({
          next: () => {
           this.alertService.show('Trainer erfolgreich gelöscht', 'Der Trainer wurde erfolgreich entfernt', "success");
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.show('Löschen fehlgeschlagen', 'Bitte probiere es später erneut', "error");
          }
        })
        this.trainer = this.trainer.filter(element => element.id !== trainer.id);
        this.selectedTrainer = null;
      }
    );
  }

  ngOnInit(): void {
    if(this.trainer.length === 0){
      this.trainerService.getAllTrainersTrainersGet().subscribe({
        next: (trainers: TrainerResponseSchema[]) => {
          this.trainer = trainers;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.show('Abfragen der Trainer fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
          this.isLoading = false;
        }
      });
    }

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const trainerId = params['id'];
      if(trainerId){
        this.selectedTrainer = this.trainer.filter(element => element.id == trainerId)[0] ?? null
        if(!this.selectedTrainer){
          this.router.navigate(['/trainer']);
        }
      }
    })
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
