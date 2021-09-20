import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTransactionComponent } from './business-transaction.component';

describe('BusinessTransactionComponent', () => {
  let component: BusinessTransactionComponent;
  let fixture: ComponentFixture<BusinessTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
