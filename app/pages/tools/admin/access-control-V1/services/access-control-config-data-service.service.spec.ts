import { TestBed, inject } from '@angular/core/testing';

import { AccessControlConfigDataServiceService } from './access-control-config-data-service.service';

describe('AccessControlConfigDataServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessControlConfigDataServiceService]
    });
  });

  it('should be created', inject([AccessControlConfigDataServiceService], (service: AccessControlConfigDataServiceService) => {
    expect(service).toBeTruthy();
  }));
});
