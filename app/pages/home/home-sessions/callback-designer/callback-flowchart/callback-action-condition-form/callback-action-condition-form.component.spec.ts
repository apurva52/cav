import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackActionConditionFormComponent } from './callback-action-condition-form.component';

describe('CallbackActionConditionFormComponent', () => {
  let component: CallbackActionConditionFormComponent;
  let fixture: ComponentFixture<CallbackActionConditionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackActionConditionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackActionConditionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
