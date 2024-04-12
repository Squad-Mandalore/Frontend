import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
        }
    ]

})
export class PasswordBoxComponent implements ControlValueAccessor {
    @Input() showPasswordGenerator: boolean = true;
    @Input() showCopyOption: boolean = true;
    @Input() showPasswordStrength: boolean = true;
    @Input() placeholderText: string = "Passwort";

    /**
      * Whether the input is disabled or not.
      */
    disabled: boolean = false;

    /**
     * The value of the input.
     */
    value: string = "";

    /**
     * Callback function to be called when the value changes.
     */
    onChange: (value: string) => void = (_: string) => { };

    /**
     * Callback function to be called when the input is touched.
     */
    onTouched: () => void = () => { };

    /**
     * Indicate if the input has been touched.
     */
    touched: boolean = false;

    /**
     * The width of the password strength bar.
     */
    strengthBarWidth: string = '20%';

    /**
     * The background color of the password strength bar.
     */
    strengthBarColor: string = '#ff6347';

    /**
     * The text content of the password strength.
     */
    strengthTextContent: string = 'Schwach';
    inputType = "password";

    constructor(private utilService: UtilService) {

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
    }

    /**
     * Handle input event, update password strength and call onChange.
     * @param value Input value
     */
    onInput(value: string): void {
        this.value = value;
        const passwordLength = this.value.length;

        // Evaluate password strength
        if (this.utilService.validatePass(this.value)) {
            this.strengthTextContent = 'Sehr stark';
            this.strengthBarWidth = '100%';
            this.strengthBarColor = '#2ecc71'; // Green
        } else if (this.utilService.validateGoodPass(this.value)) {
            this.strengthTextContent = 'Gut';
            this.strengthBarWidth = '70%';
            this.strengthBarColor = '#2ecc71'; // Green
        } else if (this.utilService.validateMiddlePass(this.value)){
            this.strengthTextContent = 'Mittel';
            this.strengthBarWidth = '50%';
            this.strengthBarColor = '#ffa500'; // Orange
        } else if (passwordLength < 5) {
            this.strengthTextContent = 'Schwach';
            this.strengthBarWidth = '20%';
            this.strengthBarColor = '#ff6347'; // Red
        }

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
