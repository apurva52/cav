import { TestBed } from '@angular/core/testing';

import { ClusterMonitorService } from './cluster-monitor.service';

describe('ClusterMonitorService', () => {
  let service: ClusterMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClusterMonitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
