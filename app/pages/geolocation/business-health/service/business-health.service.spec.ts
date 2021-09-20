import { TestBed } from '@angular/core/testing';

import { BusinessHealthService } from './business-health.service';

describe('BusinessHealthService', () => {
  let service: BusinessHealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessHealthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
