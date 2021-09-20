import { TestBed } from '@angular/core/testing';

import { ManageControllerService } from './manage-controller.service';

describe('ManageControllerService', () => {
  let service: ManageControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
