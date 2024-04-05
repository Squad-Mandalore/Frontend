import {NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {PasswordBoxComponent} from "../password-box/password-box.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertComponent} from "../alert/alert.component";
import {IconComponent} from "../icon/icon.component";
import {PrimaryButtonComponent} from "../buttons/primary-button/primary-button.component";
import {AthletePostSchema, AthletesService} from "../../shared/generated";
import {LoggerService} from "../../shared/logger.service";
import {AlertService} from "../../shared/alert.service";
import {UtilService} from "../../shared/service-util";
import { SecondaryButtonComponent } from "../buttons/secondary-button/secondary-button.component";
import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-create-exercise',
  standalone: true,
  imports: [
    IconComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgClass,
    PasswordBoxComponent,
    ReactiveFormsModule,
    FormsModule,
    AlertComponent
  ],
  templateUrl: './create-exercise-modal.component.html',
  styleUrl: './create-exercise-modal.component.scss'
})

export class CreateExerciseComponent {
  @Input() modals!: any;
  
  pageShow = 1;
}
