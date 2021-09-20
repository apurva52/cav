import { TestBed } from '@angular/core/testing';

import { AbstractChartService } from './chart.service';

describe('ChartService', () => {
  let service: AbstractChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
