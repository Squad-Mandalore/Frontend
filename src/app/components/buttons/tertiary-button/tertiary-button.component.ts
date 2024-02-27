import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tertiary-button',
  standalone: true,
  imports: [],
  template: `
    <button class="tertiary-button">
      <span>{{ text }}</span>
    </button>
  `,
  styleUrls: ['./tertiary-button.component.scss'],
})


export class TertiaryButtonComponent {
  @Input() text: string = '';
}