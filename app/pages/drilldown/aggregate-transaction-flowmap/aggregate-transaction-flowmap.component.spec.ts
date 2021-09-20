import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregateTransactionFlowmapComponent } from './aggregate-transaction-flowmap.component';

describe('AggregateTransactionFlowmapComponent', () => {
  let component: AggregateTransactionFlowmapComponent;
  let fixture: ComponentFixture<AggregateTransactionFlowmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregateTransactionFlowmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregateTransactionFlowmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
