import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsynchronousTransactionComponent } from './asynchronous-transaction.component';

describe('AsynchronousTransactionComponent', () => {
  let component: AsynchronousTransactionComponent;
  let fixture: ComponentFixture<AsynchronousTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsynchronousTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsynchronousTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
