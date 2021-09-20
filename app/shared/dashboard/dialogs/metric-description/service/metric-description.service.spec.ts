import { TestBed } from '@angular/core/testing';

import { MetricDescriptionService } from './metric-description.service';

describe('MetricDescriptionService', () => {
  let service: MetricDescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricDescriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
