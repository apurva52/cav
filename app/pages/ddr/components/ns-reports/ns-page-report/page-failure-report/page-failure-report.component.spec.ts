import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFailureReportComponent } from './page-failure-report.component';

describe('PageFailureReportComponent', () => {
  let component: PageFailureReportComponent;
  let fixture: ComponentFixture<PageFailureReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFailureReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFailureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
