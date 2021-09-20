import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureStatsDMonitorComponent } from './configure-statsd-component';

describe('CavStatsDMonitorComponent', () => {
  let component: ConfigureStatsDMonitorComponent;
  let fixture: ComponentFixture<ConfigureStatsDMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureStatsDMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureStatsDMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
