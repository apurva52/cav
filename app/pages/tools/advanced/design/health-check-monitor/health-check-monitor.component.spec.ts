import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCheckMonitorComponent } from './health-check-monitor.component';

describe('HealthCheckMonitorComponent', () => {
  let component: HealthCheckMonitorComponent;
  let fixture: ComponentFixture<HealthCheckMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthCheckMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCheckMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
