import { Component } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { PasswordBoxComponent } from '../../password-box/password-box.component';

@Component({
  selector: 'app-distanceinput',
  standalone: true,
  imports: [],
  templateUrl: './distanceinput.component.html',
  styleUrl: './distanceinput.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DistanceinputComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: DistanceinputComponent
    }
  ]
})
export class DistanceinputComponent implements ControlValueAccessor, Validator {

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if (!control.value.match(/^\d{3}:\d{3}:\d{2}$/)) {
      return {
        illegalInput: true
      }
    }
    return null;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValChange = fn;
  }
  kilometers: string = '';
  meters: string = '';
  centimeters: string = '';
  // Whether the input is disabled or not.
  disabled: boolean = false;

  // The value of the input.
  value: string = '';

  // Callback function to be called when the value changes.
  onValChange: () => void = () => { };

  // Callback function to be called when the value changes.
  onChange: (value: string) => void = (_: string) => { };

  // Callback function to be called when the input is touched.
  onTouched: () => void = () => { };

  // Indicate if the input has been touched.
  touched: boolean = false;

  writeValue(value: string): void {
    this.value = value;
    const distance: string[] = this.value.split(':');
    this.kilometers = distance[0];
    this.meters = distance[1];
    this.centimeters = distance[2];
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  change(kilometers: number, meters: number, centimeters: number) {
    let combinedCentimeters = ((kilometers || 0) * 100000) + ((meters || 0) * 100) + ((centimeters || 0) * 1);

    let kilometersResult = '';
    let metersResult = '';
    let centimetersResult = '';

    const kilometersForOutput = Math.floor(combinedCentimeters / 100000);
    if (kilometersForOutput < 10) {
      kilometersResult = '00' + kilometersForOutput.toString();
    } else if (kilometersForOutput > 9 && kilometersForOutput < 100) {
      kilometersResult = '0' + kilometersForOutput.toString();
    } else {
      kilometersResult = kilometersForOutput.toString();
    }
    combinedCentimeters %= 100000;

    const metersForOutput = Math.floor(combinedCentimeters / 100);
    if (metersForOutput < 10) {
      metersResult = '00' + metersForOutput.toString();
    } else if (metersForOutput > 9 && metersForOutput < 100) {
      metersResult = '0' + metersForOutput.toString();
    } else {
      metersResult = metersForOutput.toString();
    }
    combinedCentimeters %= 100;

    const centimetersForOutput = Math.floor(combinedCentimeters / 1);
    if (centimetersForOutput < 10) {
      centimetersResult = '0' + centimetersForOutput.toString();
    } else {
      centimetersResult = centimetersForOutput.toString();
    }

    this.value = kilometersResult + ':' + metersResult + ':' + centimetersResult;
    this.onChange(this.value);
  }
}
