import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTransactionJacketComponent } from './business-transaction-jacket.component';

describe('BusinessTransactionJacketComponent', () => {
  let component: BusinessTransactionJacketComponent;
  let fixture: ComponentFixture<BusinessTransactionJacketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessTransactionJacketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTransactionJacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
