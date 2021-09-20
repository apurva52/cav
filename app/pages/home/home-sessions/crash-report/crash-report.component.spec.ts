import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashReportComponent } from './crash-report.component';

describe('CrashReportComponent', () => {
  let component: CrashReportComponent;
  let fixture: ComponentFixture<CrashReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrashReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrashReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
