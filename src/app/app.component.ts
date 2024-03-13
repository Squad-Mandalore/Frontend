import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {CreateAthleteModalComponent} from "./create-athlete-modal/create-athlete-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CreateAthleteModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Squad-Mandalore-Frontend';
}
