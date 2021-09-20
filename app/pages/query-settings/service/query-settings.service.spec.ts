import { TestBed } from '@angular/core/testing';

import { QuerySettingsService } from './query-settings.service';

describe('QuerySettingsService', () => {
  let service: QuerySettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuerySettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
