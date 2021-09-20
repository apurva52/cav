import { TestBed } from '@angular/core/testing';

import { ChartMenuService } from './chart-menu.service';

describe('ChartMenuService', () => {
  let service: ChartMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
