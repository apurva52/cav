import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlSummaryReportComponent } from './url-summary-report.component';

describe('UrlSummaryReportComponent', () => {
  let component: UrlSummaryReportComponent;
  let fixture: ComponentFixture<UrlSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
