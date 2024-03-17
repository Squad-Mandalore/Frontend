import { Component, EventEmitter, Output, Input } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CreateTrainerModalComponent } from '../create-trainer-modal/create-trainer-modal.component';


@Component({
  selector: 'app-navbar-bottom',
  standalone: true,
  imports: [UserCardComponent, CommonModule, RouterModule, CreateTrainerModalComponent],
  templateUrl: './navbar-bottom.component.html',
  styleUrl: './navbar-bottom.component.scss'
})
export class NavbarBottomComponent {
  urlParts: any = [];
  @Input() isCreateTrainerModalActive: boolean = false;

  close(value: boolean){
    this.deactivateModal();
  }

  triggerModal(){
    this.isCreateTrainerModalActive = !this.isCreateTrainerModalActive;
  }

  activateModal(){
    this.isCreateTrainerModalActive = true;
  }
  
  deactivateModal(){
    this.isCreateTrainerModalActive = false;
  }

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
