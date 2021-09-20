import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackTriggerActionComponent } from './callback-trigger-action.component';

describe('CallbackTriggerActionComponent', () => {
  let component: CallbackTriggerActionComponent;
  let fixture: ComponentFixture<CallbackTriggerActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackTriggerActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackTriggerActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
