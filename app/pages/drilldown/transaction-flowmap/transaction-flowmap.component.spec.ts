import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFlowmapComponent } from './transaction-flowmap.component';

describe('TransactionFlowpathComponent', () => {
  let component: TransactionFlowmapComponent;
  let fixture: ComponentFixture<TransactionFlowmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionFlowmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionFlowmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
