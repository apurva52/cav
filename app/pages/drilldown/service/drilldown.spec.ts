import { TestBed } from '@angular/core/testing';

import { DrilldownService } from './drilldown.service';

describe('DashboardServiceReqService', () => {
  let service: DrilldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
