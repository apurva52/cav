import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMonitorComponent } from './check-monitor.component';

describe('AutoMonitorComponent', () => {
  let component: CheckMonitorComponent;
  let fixture: ComponentFixture<CheckMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
