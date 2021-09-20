import { TestBed } from '@angular/core/testing';

import { TimebarService } from './time-bar.service';

describe('TimebarService', () => {
  let service: TimebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
