import { TestBed } from '@angular/core/testing';

import { WidgetSubmenuService } from './widget-submenu.service';

describe('WidgetSubmenuService', () => {
  let service: WidgetSubmenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetSubmenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
