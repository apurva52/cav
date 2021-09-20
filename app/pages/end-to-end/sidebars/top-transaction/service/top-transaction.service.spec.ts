import { TestBed } from '@angular/core/testing';
import { TopTransactionService } from './top-transaction.service';


describe('TopTransactionService', () => {
  let service: TopTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
