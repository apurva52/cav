import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureLogMetricMonComponent } from './configure-log-metric-mon.component';

describe('CavNfMonitorHomeComponent', () => {
  let component: ConfigureLogMetricMonComponent;
  let fixture: ComponentFixture<ConfigureLogMetricMonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureLogMetricMonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureLogMetricMonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
