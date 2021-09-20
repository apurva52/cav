import { TestBed } from '@angular/core/testing';

import { KpiTimeFilterService } from './kpi-time-filter.service';

describe('KpiTimeFilterService', () => {
  let service: KpiTimeFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiTimeFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
