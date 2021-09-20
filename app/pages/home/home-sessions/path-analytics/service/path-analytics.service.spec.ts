import { TestBed } from '@angular/core/testing';

import { PathAnalyticsService } from './path-analytics.service';

describe('PathAnalyticsService', () => {
  let service: PathAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
