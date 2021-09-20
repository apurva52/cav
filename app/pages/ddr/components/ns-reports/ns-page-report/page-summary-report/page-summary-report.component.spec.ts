import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSummaryReportComponent } from './page-summary-report.component';

describe('PageSummaryReportComponent', () => {
  let component: PageSummaryReportComponent;
  let fixture: ComponentFixture<PageSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
