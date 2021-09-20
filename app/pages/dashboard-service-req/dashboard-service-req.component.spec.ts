import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardServiceReqComponent } from './dashboard-service-req.component';

describe('DashboardServiceReqComponent', () => {
  let component: DashboardServiceReqComponent;
  let fixture: ComponentFixture<DashboardServiceReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardServiceReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardServiceReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
