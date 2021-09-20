import { TestBed } from '@angular/core/testing';

import { DashboardServiceReqService } from './dashboard-service-req.service';

describe('DashboardServiceReqService', () => {
  let service: DashboardServiceReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardServiceReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
