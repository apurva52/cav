import { TestBed } from '@angular/core/testing';

import { HotspotService } from './hotspot.service';

describe('HotspotService', () => {
  let service: HotspotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotspotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
