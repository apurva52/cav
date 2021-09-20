import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetHavocReportComponent } from './net-havoc-report.component';

describe('NetHavocReportComponent', () => {
  let component: NetHavocReportComponent;
  let fixture: ComponentFixture<NetHavocReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetHavocReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetHavocReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
