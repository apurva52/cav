import { TestBed } from '@angular/core/testing';

import { OptionsService } from './user-options.service';

describe('FileManagerService', () => {
  let service: OptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
