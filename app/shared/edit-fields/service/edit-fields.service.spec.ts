import { TestBed } from '@angular/core/testing';

import { EditFieldsService } from './edit-fields.service';

describe('EditFieldsService', () => {
  let service: EditFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
