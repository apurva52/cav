import { TestBed } from '@angular/core/testing';

import { FlowmapsManagementService } from './flowmaps-management.service';

describe('FlowmapsManagementService', () => {
  let service: FlowmapsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowmapsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
