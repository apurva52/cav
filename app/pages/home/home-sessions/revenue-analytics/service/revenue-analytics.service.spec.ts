import { TestBed } from '@angular/core/testing';

import { RevenueAnalyticsService } from './revenue-analytics.service';

describe('RevenueAnalyticsService', () => {
  let service: RevenueAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevenueAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
