import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {LoggerService} from "./shared/logger.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'Squad-Mandalore-Frontend';

  constructor(private logger: LoggerService) {
  }

  ngOnInit(): void {
    this.logger.info("I need Help")

  }

}
