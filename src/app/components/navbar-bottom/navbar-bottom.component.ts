import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserCardComponent} from '../user-card/user-card.component';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CreateTrainerModalComponent} from '../create-trainer-modal/create-trainer-modal.component';
import {CreateAthleteModalComponent} from '../create-athlete-modal/create-athlete-modal.component';
import {AthleteFullResponseSchema, AuthService, UserResponseSchema} from "../../shared/generated";
import {AuthExtentionService} from "../../shared/auth-extention.service";
import { enterLeaveAnimation } from '../../shared/animation';


@Component({
  selector: 'app-navbar-bottom',
  standalone: true,
  imports: [UserCardComponent, CommonModule, RouterModule, CreateTrainerModalComponent, CreateAthleteModalComponent],
  templateUrl: './navbar-bottom.component.html',
  styleUrl: './navbar-bottom.component.scss',
  animations: [
    enterLeaveAnimation
  ]
})
export class NavbarBottomComponent implements OnInit {
  urlParts: any = [];
  user!: UserResponseSchema;

  constructor(
    private route: ActivatedRoute,
    private authExtService: AuthExtentionService, 
    private authService: AuthService
  ){
    this.urlParts = this.route.snapshot.url.map(segment => segment.toString());
  }

  ngOnInit(): void {
    this.getUser();
  }

  checkIfIsActive(routeParameter : string){
    return this.urlParts.includes(routeParameter);
  }

  @Output() triggerModalClick = new EventEmitter<boolean>();
  delegateToParent(value: boolean){
    this.triggerModalClick.emit(value);
  }

  getUser(){
    this.authService.whoAmIAuthWhoamiGet().subscribe({
      next: (user: UserResponseSchema) => {
        this.user = user;
      },
    });
  }

  onClickLogOut() {
    this.authExtService.logout()
  }


}
