import { TestBed } from '@angular/core/testing';

import { AuthExtentionService } from './auth-extention.service';

describe('AuthExtentionService', () => {
  let service: AuthExtentionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthExtentionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
