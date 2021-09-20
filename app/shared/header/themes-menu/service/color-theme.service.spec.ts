import { TestBed } from '@angular/core/testing';

import { ThemeService } from './color-theme.service';

describe('FileManagerService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
