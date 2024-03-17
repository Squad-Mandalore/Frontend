import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AthleteCardComponent } from '../athlete-card/athlete-card.component';
import { RouterModule } from '@angular/router';
import { QuaternaryButtonComponent } from '../buttons/quaternary-button/quaternary-button.component';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import customFilter from '../../../utils/custom-filter';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AthleteCardComponent, RouterModule, QuaternaryButtonComponent, PrimaryButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() athletes:any = [];
  searchValue = "";

  customFilterCall(array: any[], options: Object, fullFit:boolean = false){
    return customFilter(array, options, fullFit);
  }

  changeSearchValue(value: string){
    this.searchValue = value;
  }
}