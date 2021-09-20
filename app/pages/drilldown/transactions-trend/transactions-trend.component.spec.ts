import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsTrendComponent } from './transactions-trend.component';

describe('TransactionsTrendComponent', () => {
  let component: TransactionsTrendComponent;
  let fixture: ComponentFixture<TransactionsTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
