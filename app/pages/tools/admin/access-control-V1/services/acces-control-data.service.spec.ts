import { TestBed, inject } from '@angular/core/testing';

import { AccesControlDataService } from './acces-control-data.service';

describe('AccesControlDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccesControlDataService]
    });
  });

  it('should be created', inject([AccesControlDataService], (service: AccesControlDataService) => {
    expect(service).toBeTruthy();
  }));
});
