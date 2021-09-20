import { TestBed } from '@angular/core/testing';

import { ServiceMethodTimingService } from './service-method-timing.service';

describe('ServiceMethodTimingService', () => {
  let service: ServiceMethodTimingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceMethodTimingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
