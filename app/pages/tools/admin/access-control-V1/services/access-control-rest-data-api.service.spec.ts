import { TestBed, inject } from '@angular/core/testing';

import { AccessControlRestDataApiService } from './access-control-rest-data-api.service';

describe('AccessControlRestDataApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessControlRestDataApiService]
    });
  });

  it('should be created', inject([AccessControlRestDataApiService], (service: AccessControlRestDataApiService) => {
    expect(service).toBeTruthy();
  }));
});
