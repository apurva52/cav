import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackActionApiFormComponent } from './callback-action-api-form.component';

describe('CallbackActionApiFormComponent', () => {
  let component: CallbackActionApiFormComponent;
  let fixture: ComponentFixture<CallbackActionApiFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackActionApiFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackActionApiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
