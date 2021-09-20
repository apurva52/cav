import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackDatapointComponent } from './callback-datapoint.component';

describe('CallbackDatapointComponent', () => {
  let component: CallbackDatapointComponent;
  let fixture: ComponentFixture<CallbackDatapointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackDatapointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackDatapointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
