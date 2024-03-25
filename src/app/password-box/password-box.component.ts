import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../components/icon/icon.component';

@Component({
    selector: 'app-password-box',
    standalone: true,
    imports: [IconComponent],
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

    disabled: boolean = false;
    value!: string;
    onChange: (value: string) => void = (_: string) => { };
    onTouched: () => void = () => { };
    touched: boolean = false;
    width: string = '20';
    backgroundColor: string = '#ff6347';
    textContent: string = 'Schwach';
    inputType = "password";

    constructor() {

    }

    triggerInputType(){
        this.inputType = this.inputType === "password" ? "text" : "password";
    }

    registerOnChange(onChange: (_: string) => void): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(value: string): void {
        this.value = value;
    }

    onInput(value: string): void {
        this.value = value;
        const passwordLength = this.value.length;

        // Evaluate password strength
        if (passwordLength < 5) {
            this.textContent = 'Schwach';
            this.width = '20%'; // Red
            this.backgroundColor = '#ff6347';
        } else if (passwordLength < 10) {
            this.textContent = 'Mittel';
            this.width = '50%'; // Orange
            this.backgroundColor = '#ffa500';
        } else if (passwordLength >= 10 && passwordLength < 12) {
            this.textContent = 'Gut';
            this.width = '70%'; // Green
            this.backgroundColor = '#2ecc71';
        } else {
            this.textContent = 'Sehr stark';
            this.width = '100%'; // Green
            this.backgroundColor = '#2ecc71';
        }

        this.onChange(this.value);
    }

}