import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackStateDiagramComponent } from './callback-state-diagram.component';

describe('CallbackStateDiagramComponent', () => {
  let component: CallbackStateDiagramComponent;
  let fixture: ComponentFixture<CallbackStateDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackStateDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackStateDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
