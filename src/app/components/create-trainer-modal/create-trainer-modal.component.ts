import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {SecondaryButtonComponent} from "../buttons/secondary-button/secondary-button.component";
import {IconComponent} from "../icon/icon.component";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {UtilService} from "../../shared/service-util";
import {TrainerResponseSchema} from "../../shared/generated";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-create-trainer-modal',
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, IconComponent, PasswordBoxComponent, ReactiveFormsModule, AlertComponent, NgClass],
  templateUrl: './create-trainer-modal.component.html',
  styleUrl: './create-trainer-modal.component.scss',
})
export class CreateTrainerModalComponent implements OnInit{
  @Input({required: true}) modal: any;
  @Input() selectedTrainer?: TrainerResponseSchema;
  @Output() trainerCallback = new EventEmitter<FormGroup>();
  @Output() fileCallback = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile?: File;
  trainerForm;

  constructor(
    private formBuilder: FormBuilder,
    private utilService: UtilService,
  ){
    this.trainerForm = this.formBuilder.group({
      username: ['', Validators.required],
      unhashed_password: ['', [Validators.required, this.utilService.passwordValidator()]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    if(this.selectedTrainer){
      Object.keys(this.trainerForm.controls).forEach(key => {
        this.trainerForm.get(key)!.removeValidators(Validators.required);
        this.trainerForm.get(key)!.updateValueAndValidity();
      });
      this.trainerForm.patchValue({
        username: this.selectedTrainer.username,
        email: this.selectedTrainer.email,
        firstname: this.selectedTrainer.firstname,
        lastname: this.selectedTrainer.lastname,
      })
    }
  }

  onSubmit(){
    this.trainerCallback.emit(this.trainerForm);
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

    this.fileCallback.emit(this.selectedFile);
  }
}
