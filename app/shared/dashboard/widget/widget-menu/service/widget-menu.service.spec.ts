import { TestBed } from '@angular/core/testing';

import { WidgetMenuService } from './widget-menu.service';

describe('WidgetMenuService', () => {
  let service: WidgetMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
