import { TestBed } from '@angular/core/testing';

import { ShowDashboardService } from './show-dashboard.service';

describe('ShowDashboardService', () => {
  let service: ShowDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
