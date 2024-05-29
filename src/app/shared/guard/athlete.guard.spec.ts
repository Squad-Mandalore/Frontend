import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { athleteGuard } from './athlete.guard';

describe('athleteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => athleteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
