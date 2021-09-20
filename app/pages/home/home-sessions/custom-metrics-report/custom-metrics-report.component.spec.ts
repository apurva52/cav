import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMetricsReportComponent } from './custom-metrics-report.component';

describe('CustomMetricsReportComponent', () => {
  let component: CustomMetricsReportComponent;
  let fixture: ComponentFixture<CustomMetricsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomMetricsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMetricsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
