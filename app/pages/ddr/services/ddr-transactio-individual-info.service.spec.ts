import { TestBed, inject } from '@angular/core/testing';

import { DdrTransactioIndividualInfoService } from './ddr-transactio-individual-info.service';

describe('DdrTransactioIndividualInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DdrTransactioIndividualInfoService]
    });
  });

  it('should be created', inject([DdrTransactioIndividualInfoService], (service: DdrTransactioIndividualInfoService) => {
    expect(service).toBeTruthy();
  }));
});
