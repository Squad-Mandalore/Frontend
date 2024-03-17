import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from "@angular/common"

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss'
})
export class AlertComponent {
    @Input() alertTitle?: string;
    @Input() alertDescription?: string;
    @Input() alertType?: 'success' | 'error';

    @Output() closed = new EventEmitter<void>();

    onClick() {
        this.closed.emit();
    }
}
