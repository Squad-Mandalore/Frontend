import generator from 'generate-password-ts'
import PassValidator from "password-validator";
import {Injectable} from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {LoggerService} from "./logger.service";

@Injectable({providedIn: 'root'})
export class UtilService {


  constructor(private logger: LoggerService) {
  }

  /**
   * generates a password with pre-setting requirements
   * @return {string} password - random password (-> pp30"Ss[$2~Q )
   */

  public genPass():string {
    return generator.generate({
      length: 12,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true
    })
  }

  /**
   * For Form Validator
   * validates a password with pre-setting requirements -> schema: PassValidator
   * @return {boolean} - true or false Value if valid / not valid
   */

  /**
   * validates a password with pre-setting requirements -> schema: PassValidator
   * @param {string} password - Password which has to be validated
   * @return {boolean} - true or false Value if valid / not valid
   */

  public validatePass(password: string): string {
    if (veryStrongRegex.test(password)) {
      return 'VeryStrong';
    } else if (strongRegex.test(password)) {
      return 'Strong';
    } else if (mediumRegex.test(password)) {
      return 'Medium';
    } else if (weakRegex.test(password)) {
      return 'Weak';
    } else {
      return 'Illegal';
    }
  }
}

const veryStrongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W]).{12,60}$/;
const strongRegex = /^(?:(?=.*[a-z])(?=.*[A-Z])(?=.*[\d]).{12,60}|(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{12,60}|(?=.*[a-z])(?=.*[\d])(?=.*[\W]).{12,60}|(?=.*[A-Z])(?=.*[\d])(?=.*[\W]).{12,60})$/;
const mediumRegex = /^(?:(?=.*[a-z])(?=.*[A-Z]).{12,60}|(?=.*[a-z])(?=.*[\d]).{12,60}|(?=.*[a-z])(?=.*[\W]).{12,60}|(?=.*[A-Z])(?=.*[\d]).{12,60}|(?=.*[A-Z])(?=.*[\W]).{12,60}|(?=.*[\d])(?=.*[\W]).{12,60})$/;
const weakRegex = /^(?:[a-z]{12,60}|[A-Z]{12,60}|\d{12,60}|\W{12,60})$/;