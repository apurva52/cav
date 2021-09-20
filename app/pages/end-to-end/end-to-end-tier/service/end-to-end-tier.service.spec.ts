import { TestBed } from '@angular/core/testing';

import { EndToEndTierService } from './end-to-end-tier.service';

describe('EndToEndTierService', () => {
  let service: EndToEndTierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndToEndTierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
