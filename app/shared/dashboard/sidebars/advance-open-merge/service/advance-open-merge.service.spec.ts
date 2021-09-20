import { TestBed } from '@angular/core/testing';

import { AdvanceOpenMergeService } from './advance-open-merge.service';

describe('AdvanceOpenMergeService', () => {
  let service: AdvanceOpenMergeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvanceOpenMergeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
