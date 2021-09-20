import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsGroupComponent } from './transactions-group.component';

describe('TransactionsTrendComponent', () => {
  let component: TransactionsGroupComponent;
  let fixture: ComponentFixture<TransactionsGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
