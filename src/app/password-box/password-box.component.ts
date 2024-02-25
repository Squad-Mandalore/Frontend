import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-password-box',
    standalone: true,
    imports: [],
    templateUrl: './password-box.component.html',
    styleUrl: './password-box.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: PasswordBoxComponent
        }
    ]

})
export class PasswordBoxComponent implements ControlValueAccessor {

    disabled = false;
    value!: string;
    onChange = (value: string) => { };
    onTouched = () => { };
    touched = false;

    constructor() {

    }

    registerOnChange(onChange: any) {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    writeValue(value: string): void {
        this.value = value;
    }

    onInput(value: string): void {
        this.value = value;

        const passwordStrengthFill = document.getElementById('password-strength-fill');
        const passwordStrengthText = document.getElementById('password-strength-text');
        const passwordLength = this.value.length;

        // Evaluate password strength
        let strength = '';
        if (passwordLength < 5) {
            strength = 'Schwach';
            (<HTMLDivElement>passwordStrengthFill).style.width = '20%'; // Red
            (<HTMLDivElement>passwordStrengthFill).style.backgroundColor = '#ff6347';
        } else if (passwordLength < 10) {
            strength = 'Mittel';
            (<HTMLDivElement>passwordStrengthFill).style.width = '50%'; // Orange
            (<HTMLDivElement>passwordStrengthFill).style.backgroundColor = '#ffa500';
        } else if (passwordLength >= 10 && passwordLength < 12) {
            strength = 'Gut';
            (<HTMLDivElement>passwordStrengthFill).style.width = '70%'; // Green
            (<HTMLDivElement>passwordStrengthFill).style.backgroundColor = '#2ecc71';
        } else {
            strength = 'Sehr stark';
            (<HTMLDivElement>passwordStrengthFill).style.width = '100%'; // Green
            (<HTMLDivElement>passwordStrengthFill).style.backgroundColor = '#2ecc71';
        }

        // Display password strength
        (<HTMLDivElement>passwordStrengthText).textContent = 'Passwortstärke: ' + strength;

        this.onChange(this.value);
    }

}