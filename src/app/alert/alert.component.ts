import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common"
import { AlertService } from '../shared/alert.service';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule, NgClass],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss'
})
export class AlertComponent {

    protected onClick() {
        this.alertService.hide();
    }

    constructor(protected alertService: AlertService){
    }
}
