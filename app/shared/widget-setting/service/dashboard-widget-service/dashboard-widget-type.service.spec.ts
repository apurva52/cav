import { TestBed } from '@angular/core/testing';

import { DashboardWidgetTypeService } from './dashboard-widget-type.service';

describe('DashboardWidgetTypeService', () => {
  let service: DashboardWidgetTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardWidgetTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
