import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFilterSidebarComponent } from './path-analytics-sidebar.component';

describe('TransactionFilterSidebarComponent', () => {
  let component: TransactionFilterSidebarComponent;
  let fixture: ComponentFixture<TransactionFilterSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionFilterSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionFilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
