import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackHistoryComponent } from './callback-history.component';

describe('CallbackHistoryComponent', () => {
  let component: CallbackHistoryComponent;
  let fixture: ComponentFixture<CallbackHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
