import { TestBed, inject } from '@angular/core/testing';

import { AccessControlRoutingGuardService } from './access-control-routing-guard.service';

describe('AccessControlRoutingGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessControlRoutingGuardService]
    });
  });

  it('should be created', inject([AccessControlRoutingGuardService], (service: AccessControlRoutingGuardService) => {
    expect(service).toBeTruthy();
  }));
});
