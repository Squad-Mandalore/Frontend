import { Component } from '@angular/core';
import { AuthService, CsvService, ResponseParseCsvFileCsvParsePost, TrainerPatchSchema, TrainerPostSchema, TrainerResponseSchema, TrainersService, UserResponseSchema } from '../../shared/generated';
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
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private router: Router,
    private trainerService: TrainersService,
    private alertService: AlertService,
    private logger: LoggerService,
    private csvService: CsvService
  ) {}
  user!: UserResponseSchema;
  trainers: TrainerResponseSchema[] = []
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
        this.trainers.push(reponse);
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
        this.trainers = this.trainers.map(element => element.id === response.id ? response : element);
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
           this.trainers = this.trainers.filter(element => element.id !== trainer.id);
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

  csvParse(file: File) {
    this.csvService.parseCsvFileCsvParsePost(file).subscribe({
      next: (response: ResponseParseCsvFileCsvParsePost) => {
        let arr: string[] = Object.keys(response).map(key => `${key}: ${response[key as keyof typeof response]}`);
        let str: string = arr.join('\n');
        this.gnNoTini();
        this.alertService.show('CSV-Daten erfolgreich hinzugefügt', str, 'success');
        // no loop because no type
        this.modals.showDetails.isActive = false;
        this.modals.patchTrainerModal.isActive = false;
        this.modals.createTrainerModal.isActive = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Hochladen der CSV-Datei fehlgeschlagen', error.error.detail, 'error');
      },
    })
  }

  gnNoTini(): void {
    this.trainers.length = 0;
    this.trainerService.getAllTrainersTrainersGet().subscribe({
      next: (trainers: TrainerResponseSchema[]) => {
        for(const trainer of trainers){
          this.trainers.push(trainer);
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Abfragen der Trainer fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
        this.isLoading = false;
      },
      complete: () => {
        this.routeSubscription = this.route.queryParams.subscribe(params => {
          const trainerId = params['id'];
          if(trainerId){
            this.selectedTrainer = this.trainers.filter(element => element.id == trainerId)[0];
              if(!this.selectedTrainer){
                this.router.navigate(['/trainer']);
              }
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.authService.whoAmIAuthWhoamiGet().subscribe({
      next: (user: UserResponseSchema) => {
        this.user = user;
      },
      complete: ()=>{
        if(this.user.type === 'trainer'){
          this.trainerService.getTrainerTrainersIdGet(this.user.id).subscribe({
            next: (trainer: TrainerResponseSchema) => {
              this.selectedTrainer = trainer;
            }
          })
          return;
        }

        if(this.trainers.length === 0){
          this.trainerService.getAllTrainersTrainersGet().subscribe({
            next: (trainers: TrainerResponseSchema[]) => {
              this.trainers = trainers;
              this.isLoading = false;
            },
            error: (error: HttpErrorResponse) => {
              this.alertService.show('Abfragen der Trainer fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
              this.isLoading = false;
            },
            complete: () => {
              this.routeSubscription = this.route.queryParams.subscribe(params => {
                const trainerId = params['id'];
                
                if(trainerId){
                  this.selectedTrainer = this.trainers.filter(element => element.id == trainerId)[0];
                  if(!this.selectedTrainer){
                    this.router.navigate(['/trainer']);
                  }
                }
              });
            }
          });
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
