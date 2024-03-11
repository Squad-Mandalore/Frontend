import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
})

export class PrimaryButtonComponent {
  // @Input() showIcon: Boolean = false;
  @Input() text: string = '';
  @Input() iconName: string = '';
  @Input() iconColor: string = "var(--accent-0)";
  @Input() showLoader: boolean = false;
  @Input() description: string = '';
  @Input() minWidth: string = '80px';
  @Input() strokeWidth: string = '2.3';
  @Input() iconWidth: string = '15';
  @Input() iconHeight: string = '15';
  tempIcon : string = '';

  activateLoader(){
    if(this.showLoader === true && this.iconName !== ''){
      this.tempIcon = this.iconName;
      this.iconName = "loader";

      setTimeout(()=>{
        this.deactivateLoader()
      }, 2000)
    }
  }

  deactivateLoader(){
    if(this.iconName === 'loader'){
      this.iconName = this.tempIcon;
    }
  }
}
