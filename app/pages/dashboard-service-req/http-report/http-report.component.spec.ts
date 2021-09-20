import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpReportComponent } from './http-report.component';

describe('HttpReportComponent', () => {
  let component: HttpReportComponent;
  let fixture: ComponentFixture<HttpReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
