import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlFailureReportComponent } from './url-failure-report.component';

describe('UrlFailureReportComponent', () => {
  let component: UrlFailureReportComponent;
  let fixture: ComponentFixture<UrlFailureReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlFailureReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlFailureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
