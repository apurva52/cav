import { TestBed } from '@angular/core/testing';

import { HttpReportService } from './http-report.service';

describe('HttpReportService', () => {
  let service: HttpReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
