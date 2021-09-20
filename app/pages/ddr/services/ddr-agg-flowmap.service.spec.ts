import { TestBed, inject } from '@angular/core/testing';

import { DdrAggFlowmapService } from './ddr-agg-flowmap.service';

describe('DdrAggFlowmapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DdrAggFlowmapService]
    });
  });

  it('should be created', inject([DdrAggFlowmapService], (service: DdrAggFlowmapService) => {
    expect(service).toBeTruthy();
  }));
});
