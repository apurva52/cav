import { TestBed, inject } from '@angular/core/testing';

import { DdrBreadcrumbService } from './ddr-breadcrumb.service';

describe('DdrBreadcrumbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DdrBreadcrumbService]
    });
  });

  it('should be created', inject([DdrBreadcrumbService], (service: DdrBreadcrumbService) => {
    expect(service).toBeTruthy();
  }));
});
