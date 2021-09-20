import { TestBed } from '@angular/core/testing';

import { DerivedMetricService } from './derived-metric.service';

describe('DerivedMetricService', () => {
  let service: DerivedMetricService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DerivedMetricService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
