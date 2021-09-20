import { TestBed, inject } from '@angular/core/testing';

import { DdrTxnFlowmapDataService } from './ddr-txn-flowmap-data.service';

describe('DdrTxnFlowmapDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DdrTxnFlowmapDataService]
    });
  });

  it('should be created', inject([DdrTxnFlowmapDataService], (service: DdrTxnFlowmapDataService) => {
    expect(service).toBeTruthy();
  }));
});
