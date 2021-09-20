import { TestBed } from '@angular/core/testing';

import { MarketingAnalyticsService } from './marketing-analytics.service';

describe('MarketingAnalyticsService', () => {
  let service: MarketingAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketingAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
