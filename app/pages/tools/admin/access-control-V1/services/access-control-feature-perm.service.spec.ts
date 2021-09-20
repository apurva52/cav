import { TestBed, inject } from '@angular/core/testing';

import { AccessControlFeaturePermService } from './access-control-feature-perm.service';

describe('AccessControlFeaturePermService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessControlFeaturePermService]
    });
  });

  it('should be created', inject([AccessControlFeaturePermService], (service: AccessControlFeaturePermService) => {
    expect(service).toBeTruthy();
  }));
});
