import { TestBed } from '@angular/core/testing';

import { HavocReportService } from './havoc-report.service';

describe('HavocReportService', () => {
  let service: HavocReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HavocReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
