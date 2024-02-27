import { Component, EventEmitter, Output } from '@angular/core';
import { ChildComponent } from '../child/child.component';

@Component({
    selector: 'app-parent',
    standalone: true,
    imports: [ChildComponent],
    templateUrl: './parent.component.html',
    styleUrl: './parent.component.scss'
})
export class ParentComponent {

    @Output() customClick = new EventEmitter<string>();

    eineMethodeDieAusgelostwird(value: string) {
        this.customClick.emit(value);

    }
}
