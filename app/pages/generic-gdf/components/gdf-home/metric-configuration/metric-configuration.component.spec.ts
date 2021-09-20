import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricConfigurationComponent } from './metric-configuration.component';

describe('MetricConfigurationComponent', () => {
  let component: MetricConfigurationComponent;
  let fixture: ComponentFixture<MetricConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
