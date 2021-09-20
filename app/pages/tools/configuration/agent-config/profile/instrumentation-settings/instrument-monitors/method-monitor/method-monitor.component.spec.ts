import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodMonitorComponent } from './method-monitor.component';

describe('MethodMonitorComponent', () => {
  let component: MethodMonitorComponent;
  let fixture: ComponentFixture<MethodMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
