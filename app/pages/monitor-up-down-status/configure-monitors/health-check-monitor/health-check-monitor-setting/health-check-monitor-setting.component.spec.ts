import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCheckMonitorSettingComponent } from './health-check-monitor-setting.component';

describe('HealthCheckMonitorSettingComponent', () => {
  let component: HealthCheckMonitorSettingComponent;
  let fixture: ComponentFixture<HealthCheckMonitorSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthCheckMonitorSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCheckMonitorSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
