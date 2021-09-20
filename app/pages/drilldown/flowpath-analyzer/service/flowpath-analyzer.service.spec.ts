import { TestBed } from '@angular/core/testing';

import { FlowpathAnalyzerService } from './flowpath-analyzer.service';

describe('FlowpathAnalyzerService', () => {
  let service: FlowpathAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowpathAnalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
