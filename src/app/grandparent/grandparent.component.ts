import { Component, EventEmitter, Output } from '@angular/core';
import { ParentComponent } from '../parent/parent.component';

@Component({
    selector: 'app-grandparent',
    standalone: true,
    imports: [ParentComponent],
    templateUrl: './grandparent.component.html',
    styleUrl: './grandparent.component.scss'
})
export class GrandparentComponent {
    @Output() customClick = new EventEmitter<string>();
    tolleMethode(value: string) {
        this.customClick.emit(value);
    }
}
