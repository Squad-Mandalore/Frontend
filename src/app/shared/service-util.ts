import generator from 'generate-password-ts'
import PassValidator from "password-validator";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class UtilService {


  constructor() {
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
   * validates a password with pre-setting requirements -> schema: PassValidator
   * @param {string} password - Password which has to be validated
   * @return {boolean} - true or false Value if valid / not valid
   */

  public validatePass(password:string) {
    return schema.validate(password);
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

