import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {SecondaryButtonComponent} from "../buttons/secondary-button/secondary-button.component";
import {IconComponent} from "../icon/icon.component";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {AlertService} from "../../shared/alert.service";
import {UtilService} from "../../shared/service-util";
import {CsvService, ResponseParseCsvFileCsvParsePost, TrainerPostSchema, TrainerResponseSchema, TrainersService} from "../../shared/generated";
import {NgClass} from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-create-trainer-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, IconComponent, PasswordBoxComponent, ReactiveFormsModule, AlertComponent, NgClass],
  templateUrl: './create-trainer-modal.component.html',
  styleUrl: './create-trainer-modal.component.scss',
})
export class CreateTrainerModalComponent {
  @Input() modals!: any;
  @Input() trainer!: TrainerResponseSchema[];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;

  trainerForm;
  constructor(private formBuilder: FormBuilder, private alertService: AlertService, private utilService: UtilService, private trainerService: TrainersService, private csvService: CsvService){
    this.trainerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, utilService.passwordValidator()]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(){
    let body: TrainerPostSchema = {
      username: this.trainerForm.value.username!,
      unhashed_password: this.trainerForm.value.password!,
      firstname: this.trainerForm.value.firstname!,
      lastname: this.trainerForm.value.lastname!,
      email: this.trainerForm.value.email!,
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

  triggerFileInput(): void {
    this.fileInput.nativeElement.click(); // This will open the file dialog
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    this.onCSVSubmit();
  }

  onCSVSubmit(){
    if (!this.selectedFile) {
      return;
    }

    this.csvService.parseCsvFileCsvParsePost(this.selectedFile).subscribe({
      next: (response: ResponseParseCsvFileCsvParsePost) => {
        let arr: string[] = [];
        Object.keys(response).forEach((key) => {
          const value = (response as any)[key];
          arr.push(`Key: ${key}, Value: ${value}`);
        });
        let str: string = '';
        for (const strt of arr) {
          str += strt + '\n';
        }
        this.alertService.show('ERFOLG!', str, 'success');
        this.modals.createTrainerModal.isActive = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('FEHLSCHLAG!', error.error.detail, 'error');
      },
    })
  }
}
