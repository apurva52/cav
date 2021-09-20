import { TestBed } from '@angular/core/testing';

import { ConfigureSidebarService } from './configure-sidebar.service';

describe('ConfigureSidebarService', () => {
  let service: ConfigureSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigureSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
