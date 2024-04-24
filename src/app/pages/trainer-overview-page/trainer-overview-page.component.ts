import { Component } from '@angular/core';
import { TrainerPatchSchema, TrainerPostSchema, TrainerResponseSchema, TrainersService } from '../../shared/generated';
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
import { FormGroup } from '@angular/forms';
import { LoggerService } from '../../shared/logger.service';

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
  constructor(private route: ActivatedRoute, private confirmationService: ConfirmationService, private router: Router, private trainerService: TrainersService, private alertService: AlertService, private logger: LoggerService) { }
  trainer: TrainerResponseSchema[] = []
  selectedTrainer?: TrainerResponseSchema;
  isLoading: boolean = true;
  routeSubscription!: Subscription;
  modals = {
    createTrainerModal: {
      isActive: false,
      title: 'Neuen Trainer hinzufügen',
      primeButtonText: 'Trainer anlegen',
    },
    patchTrainerModal: {
      isActive: false,
      title: 'Trainer bearbeiten',
      primeButtonText: 'Speichern',
    },
    showDetails: {
      isActive: false,
    },
  }

  createTrainer(trainerForm: FormGroup){
    if (!trainerForm.valid) {
     this.logger.error('Form invalid');
     return;
    }
    // Add Data for the Http-Request for the Backend
    let body: TrainerPostSchema = {
      ...trainerForm.value
    };
    this.trainerService.createTrainerTrainersPost(body).subscribe({
      next: (reponse: TrainerResponseSchema) => {
        this.alertService.show('Trainer erstellt', 'Trainer wurde erfolgreich erstellt.', 'success');
        this.modals.createTrainerModal.isActive = false;
        this.trainer.push(reponse);
      },
      error: (error) => {
        if(error.status == 422){
          this.alertService.show('Erstellung fehlgeschlagen','Benutzername ist nicht verfügbar.',"error");
        }else{
          this.alertService.show('Erstellung fehlgeschlagen','Bitte versuche es später erneut',"error");
        }
      }
    });

  }
  patchTrainer(trainerForm: FormGroup){
    // Add Data for the Http-Request for the Backend
    let body: TrainerPatchSchema = {
      ...trainerForm.value
    };
    //delete empty fields, so they wont be overwritten
    Object.keys(body).forEach(key => {
      if(body[key as keyof TrainerPatchSchema] === "") {
        delete body[key as keyof TrainerPatchSchema];
      }
    });
    this.trainerService.updateTrainerTrainersIdPatch(this.selectedTrainer!.id, body).subscribe({
      next: (response: TrainerResponseSchema) => {
        this.alertService.show('Trainer aktualisier', 'Trainer wurde erfolgreich bearbeitet.', 'success');
        this.modals.patchTrainerModal.isActive = false;
        this.selectedTrainer = response;
        this.trainer = this.trainer.map(element => element.id === response.id ? response : element);
      },
      error: (error) => {
        if(error.status == 422){
          this.alertService.show('Erstellung fehlgeschlagen','Benutzername ist nicht verfügbar.',"error");
        }else{
          this.alertService.show('Erstellung fehlgeschlagen','Bitte versuche es später erneut',"error");
        }
      }
    });

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
           this.trainer = this.trainer.filter(element => element.id !== trainer.id);
           this.selectedTrainer = undefined;
           this.modals.showDetails.isActive = false;
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.show('Löschen fehlgeschlagen', 'Bitte probiere es später erneut', "error");
          }
        })
      }
    );
  }

  ngOnInit(): void {
    if(this.trainer.length === 0){
      this.trainerService.getAllTrainersTrainersGet().subscribe({
        next: (trainers: TrainerResponseSchema[]) => {
          this.trainer = trainers;
          this.isLoading = false;
          console.log("here");
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.show('Abfragen der Trainer fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
          this.isLoading = false;
        },
        complete: () => {
          this.routeSubscription = this.route.queryParams.subscribe(params => {
            const trainerId = params['id'];
            console.log('there');
            if(trainerId){
              this.selectedTrainer = this.trainer.filter(element => element.id == trainerId)[0];
                if(!this.selectedTrainer){
                  this.router.navigate(['/trainer']);
                }
            }
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
