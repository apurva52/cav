import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportSettingsComponent } from './add-report-settings.component';

describe('AddReportSettingsComponent', () => {
  let component: AddReportSettingsComponent;
  let fixture: ComponentFixture<AddReportSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReportSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
