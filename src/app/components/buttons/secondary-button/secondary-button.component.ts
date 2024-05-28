import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
    selector: 'app-secondary-button',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './secondary-button.component.html',
    styleUrls: ['./secondary-button.component.scss'],
})


export class SecondaryButtonComponent {
    @Input() text: string = '';
    @Input() iconName: string = '';
    @Input() iconColor: string = "var(--accent-900)";
    @Input() description: string = '';
    @Input() minWidth: string = '80px';
    @Input() strokeWidth: string = '2.3';
    @Input() iconWidth: string = '15';
    @Input() iconHeight: string = '15';
    @Input() disabled: boolean = false;
    @Input() type: string = 'button';
}
