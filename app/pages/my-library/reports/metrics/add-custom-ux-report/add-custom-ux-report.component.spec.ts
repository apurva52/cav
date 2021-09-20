import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomUxReportComponent } from './add-custom-ux-report.component';

describe('AddCustomUxReportComponent', () => {
  let component: AddCustomUxReportComponent;
  let fixture: ComponentFixture<AddCustomUxReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomUxReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomUxReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
