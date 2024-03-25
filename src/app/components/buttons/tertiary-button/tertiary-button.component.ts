import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-tertiary-button',
    standalone: true,
    imports: [],
    templateUrl: './tertiary-button.component.html',
    styleUrls: ['./tertiary-button.component.scss'],
})


export class TertiaryButtonComponent {
    @Input() text: string = '';
    @Input() description: string = '';
    @Input() disabled: boolean = false;
    @Output() click = new EventEmitter<any>();

    onButtonClick(event: Event) {
        this.click.emit(event);
    }
}