import { TestBed } from '@angular/core/testing';

import { SearchSidebarService } from './search-sidebar.service';

describe('SearchSidebarService', () => {
  let service: SearchSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
