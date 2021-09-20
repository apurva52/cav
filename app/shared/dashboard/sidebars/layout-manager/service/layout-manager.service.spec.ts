import { TestBed } from '@angular/core/testing';

import { DashboardLayoutManagerService } from './layout-manager.service';

describe('LayoutManagerService', () => {
  let service: DashboardLayoutManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardLayoutManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
