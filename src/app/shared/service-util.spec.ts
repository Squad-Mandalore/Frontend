import {TestBed} from '@angular/core/testing';
import {UtilService} from './service-util';
import PassValidator from 'password-validator';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService, PassValidator],
    });

    service = TestBed.inject(UtilService);
  });

  it('should generate a password which is valid', () => {
    const generatedPassword = service.genPass();

    expect(generatedPassword).not.toBeNull();
    expect(service.validatePass(generatedPassword)).toBeTrue()
  });

  it('should validate a valid password', () => {
    const validPassword = 'ChickenWings69!?';
    expect(service.validatePass(validPassword)).toBeTrue();
  });

  it('should not validate a password that is too short', () => {
    const shortPassword = 'Ham69!?';
    expect(service.validatePass(shortPassword)).toBeFalse();
  });

  it('should not validate a password with no symbols', () => {
    const passwordWithoutSymbols = 'HamburgerWithoutHam42';
    expect(service.validatePass(passwordWithoutSymbols)).toBeFalse();
  });

});
