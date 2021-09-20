import { TestBed } from '@angular/core/testing';

import { EndToEndGraphicalService } from './end-to-end-graphical.service';

describe('EndToEndGraphicalService', () => {
  let service: EndToEndGraphicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndToEndGraphicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
