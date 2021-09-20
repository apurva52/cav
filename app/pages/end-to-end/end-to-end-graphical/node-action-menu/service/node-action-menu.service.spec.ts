import { TestBed } from '@angular/core/testing';

import { NodeActionMenuService } from './node-action-menu.service';

describe('NodeActionMenuService', () => {
  let service: NodeActionMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeActionMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
