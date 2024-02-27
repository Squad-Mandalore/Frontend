import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-child',
    standalone: true,
    imports: [],
    templateUrl: './child.component.html',
    styleUrl: './child.component.scss'
})
export class ChildComponent {
    value = 'sdfasdf';

    @Output() customClick = new EventEmitter<string>();

    onClick(value: string) {
        this.customClick.emit(value);
    }

}
