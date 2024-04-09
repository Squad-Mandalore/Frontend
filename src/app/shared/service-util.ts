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

  public passwordValidator(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = this.validatePass(control.value);
      return !valid ? {invalidPassword: {value: control.value}} : null;
    }
  }


  /**
   * validates a password with pre-setting requirements -> schema: PassValidator
   * @param {string} password - Password which has to be validated
   * @return {boolean} - true or false Value if valid / not valid
   */

  public validatePass(password:string) {
    return schema.validate(password);
  }

  public validateGoodPass(password:string) {
    return goodSchema.validate(password)
  }

  public validateMiddlePass(password:string) {
    return middleSchema.validate(password)
  }
}

const schema = new PassValidator();

schema
  .is().min(12)
  .is().max(69)
  .has().symbols()
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces()

const goodSchema = new PassValidator();

goodSchema
  .is().min(10)
  .has().uppercase()
  .has().lowercase()
  .has().digits()

const middleSchema = new PassValidator();

middleSchema
  .is().min(5)




