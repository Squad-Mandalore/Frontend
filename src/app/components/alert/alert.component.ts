import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common"

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule, NgClass],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss'
})
export class AlertComponent {
    @Input() alertTitle?: string;
    @Input() alertDescription?: string;
    @Input({ required: true }) alertType!: 'success' | 'error';
    @Input({ required: true }) isActive!: boolean;

    @Output() closed = new EventEmitter<void>();

    onClick() {
        this.closed.emit();
    }
}
