import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './components/alert/alert.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import {LoggerService} from "./shared/logger.service";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, AlertComponent, ConfirmationModalComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    constructor(private logger: LoggerService) {
    }

    ngOnInit(): void {
        this.logger.info("I need Help")

    }

}
