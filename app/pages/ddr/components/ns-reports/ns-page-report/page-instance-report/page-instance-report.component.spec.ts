import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInstanceReportComponent } from './page-instance-report.component';

describe('PageInstanceReportComponent', () => {
  let component: PageInstanceReportComponent;
  let fixture: ComponentFixture<PageInstanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageInstanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInstanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
