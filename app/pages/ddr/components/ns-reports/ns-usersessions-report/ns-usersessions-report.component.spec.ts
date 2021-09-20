import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsUsersessionsReportComponent } from './ns-usersessions-report.component';

describe('NsUsersessionsReportComponent', () => {
  let component: NsUsersessionsReportComponent;
  let fixture: ComponentFixture<NsUsersessionsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsUsersessionsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsUsersessionsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
