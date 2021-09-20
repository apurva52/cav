import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlInstanceReportComponent } from './url-instance-report.component';

describe('UrlInstanceReportComponent', () => {
  let component: UrlInstanceReportComponent;
  let fixture: ComponentFixture<UrlInstanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlInstanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlInstanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
