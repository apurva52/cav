import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertActionHistoryComponent } from './alert-action-history.component';

describe('AlertActionHistoryComponent', () => {
  let component: AlertActionHistoryComponent;
  let fixture: ComponentFixture<AlertActionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertActionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertActionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
