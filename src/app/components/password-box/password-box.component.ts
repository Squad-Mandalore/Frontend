import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { IconComponent } from "../icon/icon.component";
import {UtilService} from "../../shared/service-util";
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-password-box',
    standalone: true,
    imports: [IconComponent, NgIf],
    templateUrl: './password-box.component.html',
    styleUrl: './password-box.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: PasswordBoxComponent
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: PasswordBoxComponent
        }
    ]

})

export class PasswordBoxComponent implements ControlValueAccessor, Validator {
    @Input() showPasswordGenerator: boolean = true;
    @Input() showCopyOption: boolean = true;
    @Input() showPasswordStrength: boolean = true;
    @Input() isAllowedToFail: boolean = false;
    @Input() placeholderText: string = "Passwort";

    illegalPassword: boolean = false;

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

    // The width of the password strength bar.
    strengthBarWidth: string = '0%';

    // The background color of the password strength bar.
    strengthBarColor: string = '#ff6347';

    // The text content of the password strength.
    strengthTextContent: string = 'Nicht Zulässig';
    inputType = "password";

    constructor(private utilService: UtilService) {

    }

    validate(c: AbstractControl): ValidationErrors | null {
        if(!this.validateValues()){
            return {
                illegalPassword: true
            }
        }
        return null;
    }

    validateValues(){
        const password = this.value;
        if(this.isAllowedToFail && !password) {
          this.illegalPassword = false;
          return true;
        }

        if(this.utilService.validatePass(password!) === 'Illegal'){
          this.illegalPassword = true;
          return false;
        }else{
          this.illegalPassword = false;
          return true;
        }
    }

    triggerInputType() {
        this.inputType = this.inputType === "password" ? "text" : "password";
    }

    /**
    * Register callback function to be called when the value changes.
    * @param onChange Callback function
    */
    registerOnChange(onChange: (_: string) => void): void {
        this.onChange = onChange;
    }

    /**
     * Register callback function to be called when the input is touched.
     * @param onTouched Callback function
     */
    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    /**
     * Set the disabled state of the input.
     * @param isDisabled Whether the input should be disabled or not
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Write value to the input.
     * @param value Value to be written to the input
     */
    writeValue(value: string): void {
        this.value = value;
        this.evaluatePasswordStrength(this.value);
    }

    /**
     * Handle input event, update password strength and call onChange.
     * @param value Input value
     */

    evaluatePasswordStrength(value: string): void {
        if (this.utilService.validatePass(value) == 'VeryStrong') {
            this.strengthTextContent = 'Sehr stark';
            this.strengthBarWidth = '100%';
            this.strengthBarColor = '#00FF00';
        } else if (this.utilService.validatePass(value) == 'Strong') {
            this.strengthTextContent = 'Stark';
            this.strengthBarWidth = '75%';
            this.strengthBarColor = '#80C000';
        } else if (this.utilService.validatePass(value) == 'Medium'){
            this.strengthTextContent = 'Mittel';
            this.strengthBarWidth = '50%';
            this.strengthBarColor = '#FF8000';
        } else if (this.utilService.validatePass(value) == 'Weak'){
            this.strengthTextContent = 'Schwach';
            this.strengthBarWidth = '25%';
            this.strengthBarColor = '#FF0000';
        } else if (this.utilService.validatePass(value) == 'Illegal') {
            this.strengthTextContent = 'Nicht Zulässig';
            this.strengthBarWidth = '0%';
            this.strengthBarColor = '#FF0000';
        }
    }

    onInput(value: string): void {
        this.value = value;
        this.evaluatePasswordStrength(value);
        this.onChange(this.value);
    }

    onTriggerCopy() {
      navigator.clipboard.writeText(this.value)
    }

    OnClickGenerate():void {
      this.value = this.utilService.genPass()
      this.onInput(this.value)
    }
}

interface formValidation {
    illegalPassword: boolean,
}
