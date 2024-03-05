import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tertiary-button',
  standalone: true,
  imports: [],
  templateUrl: './tertiary-button.component.html',
  styleUrls: ['./tertiary-button.component.scss'],
})


export class TertiaryButtonComponent {
  @Input() text: string = '';
}