import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common"
import { AlertService } from '../shared/alert.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule, NgClass],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss',
    animations: [
        trigger('enterAnimation', [
            transition(':enter', [
                style({transform: 'translateX(20px)', opacity: 0}),
                animate('300ms', style({transform: 'translateX(0)', opacity: 1}))
            ]),
            transition(':leave', [
                style({transform: 'translateX(0)', opacity: 1}),
                animate('300ms', style({transform: 'translateX(20px)', opacity: 0}))
            ])
        ])
    ]
})
export class AlertComponent {

    protected onClick() {
        this.alertService.hide();
    }

    constructor(protected alertService: AlertService){
    }
}
