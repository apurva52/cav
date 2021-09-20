import { TestBed } from '@angular/core/testing';

import { DashboardFavListService } from './dashboard-fav-list.service';

describe('DashboardFavListService', () => {
  let service: DashboardFavListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardFavListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
