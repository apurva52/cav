import { TestBed } from '@angular/core/testing';

import { GraphInTreeService } from './graph-in-tree.service';

describe('GraphInTreeService', () => {
  let service: GraphInTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphInTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
