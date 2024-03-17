import { Component, EventEmitter, Output, Input } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CreateTrainerModalComponent } from '../create-trainer-modal/create-trainer-modal.component';
import { CreateAthleteModalComponent } from '../create-athlete-modal/create-athlete-modal.component';


@Component({
  selector: 'app-navbar-bottom',
  standalone: true,
  imports: [UserCardComponent, CommonModule, RouterModule, CreateTrainerModalComponent, CreateAthleteModalComponent],
  templateUrl: './navbar-bottom.component.html',
  styleUrl: './navbar-bottom.component.scss'
})
export class NavbarBottomComponent {
  urlParts: any = [];
  @Input() modals!: any;

  // close(modalName: string){
  //   console.log(modalName);
  //   this.deactivateModal(modalName);
  // }

  // triggerModal(modalName: string){
  //   this.modals[modalName].isActive = !this.modals[modalName].isActive;
  // }

  // activateModal(modalName: string){
  //   this.modals[modalName].isActive = true;
  // }
  
  // deactivateModal(modalName: string){
  //   this.modals[modalName].isActive = false;
  // }

  constructor(private route: ActivatedRoute) {
    this.urlParts = this.route.snapshot.url.map(segment => segment.toString());
  }

  checkIfIsActive(routeParameter : string){
    return this.urlParts.includes(routeParameter);
  }

  @Output() triggerModalClick = new EventEmitter<boolean>();
  delegateToParent(value: boolean){
    this.triggerModalClick.emit(value);
  }

  user = {
    id: 1,
    firstname: 'Kay',
    lastname: 'Schulz',
    type: 'Administrator',
    username: 'KaySchulz42'
  }
}
