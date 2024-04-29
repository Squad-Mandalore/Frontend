import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AthleteCardComponent } from '../athlete-card/athlete-card.component';
import { RouterModule } from '@angular/router';
import { QuaternaryButtonComponent } from '../buttons/quaternary-button/quaternary-button.component';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import customFilter from '../../../utils/custom-filter';
import { IconComponent } from '../icon/icon.component';
import { AthleteFullResponseSchema, TrainerResponseSchema } from '../../shared/generated';
import { TrainerCardComponent } from '../trainer-card/trainer-card.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AthleteCardComponent, RouterModule, TrainerCardComponent, QuaternaryButtonComponent, PrimaryButtonComponent, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() athletes: AthleteFullResponseSchema[] = [];
  @Input() trainers: TrainerResponseSchema[] = [];
  @Input() type!: "athlete" | "trainer";
  @Input() modals: any = {};
  @Input() isLoading!: boolean;
  searchValue = "";

  customFilterCallAthletes(array: any[], options: Object, selectionFullFit:boolean = false){
    return customFilter(array, options, selectionFullFit, "athlete");
  }

  customFilterCallTrainer(array: any[], options: Object, selectionFullFit:boolean = false){
    return customFilter(array, options, selectionFullFit, "athlete");
  }
}
