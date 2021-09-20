import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRunReportComponent } from './test-run-report.component';

describe('TestRunReportComponent', () => {
  let component: TestRunReportComponent;
  let fixture: ComponentFixture<TestRunReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestRunReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRunReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
