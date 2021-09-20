import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwsMonitoringComponent } from './aws-monitoring.component';

describe('AwsMonitoringComponent', () => {
  let component: AwsMonitoringComponent;
  let fixture: ComponentFixture<AwsMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwsMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwsMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
