import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodTraceComponent } from './method-trace.component';

describe('MethodTraceComponent', () => {
  let component: MethodTraceComponent;
  let fixture: ComponentFixture<MethodTraceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodTraceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodTraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
