import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTransactionComponent } from './top-transaction.component';

describe('TopTransactionComponent', () => {
  let component: TopTransactionComponent;
  let fixture: ComponentFixture<TopTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
