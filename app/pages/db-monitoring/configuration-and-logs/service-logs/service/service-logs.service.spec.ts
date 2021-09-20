import { TestBed } from '@angular/core/testing';

import { ServiceLogsService } from './service-logs.service';

describe('ServiceLogsService', () => {
  let service: ServiceLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
