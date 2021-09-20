import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceMetricConfigurationComponent } from './advance-metric-configuration.component';

describe('AdvanceMetricConfigurationComponent', () => {
  let component: AdvanceMetricConfigurationComponent;
  let fixture: ComponentFixture<AdvanceMetricConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceMetricConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceMetricConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
