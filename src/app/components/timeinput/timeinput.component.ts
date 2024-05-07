import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-timeinput',
  standalone: true,
  imports: [],
  templateUrl: './timeinput.component.html',
  styleUrl: './timeinput.component.scss',
  providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: TimeinputComponent
        }
      ]
})
export class TimeinputComponent implements ControlValueAccessor {
  // Whether the input is disabled or not.
  disabled: boolean = false;

  // The value of the input.
  value: string = "";

  // Callback function to be called when the value changes.
  onChange: (value: string) => void = (_: string) => { };

  // Callback function to be called when the input is touched.
  onTouched: () => void = () => { };

  // Indicate if the input has been touched.
  touched: boolean = false;

  writeValue(value: string): void {
    this.value = value;
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

  change(hours: number, minutes: number, seconds: number, milliseconds:number){
    let combinedSeconds = ((hours || 0) * 3600) + ((minutes || 0) * 60) + ((seconds || 0) * 1) + ((milliseconds || 0) * 0.001);
    console.log(combinedSeconds);

    let hoursResult = '';
    let minutesResult = '';
    let secondsResult = '';
    let millisecondsResult = '';

    // Stunden
    let hoursForOutput = Math.floor(combinedSeconds / 3600);
    if(hoursForOutput < 10) {
      hoursResult = '0'+hoursForOutput.toString();
    } else {
      hoursResult = hoursForOutput.toString();
    }
    combinedSeconds %= 3600;

    // Minuten
    let minutesForOutput = Math.floor(combinedSeconds / 60);
    if(minutesForOutput < 10) {
      minutesResult = '0'+minutesForOutput.toString();
    } else {
      minutesResult = minutesForOutput.toString();
    }
    combinedSeconds %= 60;

    // Sekunden
    let secondsForOutput = Math.floor(combinedSeconds / 1);
    if(secondsForOutput < 10) {
      secondsResult = '0'+secondsForOutput.toString();
    } else {
      secondsResult = secondsForOutput.toString();
    }
    combinedSeconds %= 1;

    // Millisekunden
    let millisecondsForOutput = Math.floor(combinedSeconds * 1000);
    if(millisecondsForOutput < 10) {
      millisecondsResult = '00'+millisecondsForOutput.toString();
    } else if(millisecondsForOutput > 9 && millisecondsForOutput < 100) {
      millisecondsResult = '0'+millisecondsForOutput.toString();
    } else {
      millisecondsResult = millisecondsForOutput.toString();
    }

    this.value = hoursResult+':'+minutesResult+':'+secondsResult+':'+millisecondsResult;
    console.log(this.value);
    this.onChange(this.value);
  }
}
