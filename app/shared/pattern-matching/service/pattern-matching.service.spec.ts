import { TestBed } from '@angular/core/testing';

import { PatternMatchingService } from './pattern-matching.service';

describe('PatternMatchingService', () => {
  let service: PatternMatchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatternMatchingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
