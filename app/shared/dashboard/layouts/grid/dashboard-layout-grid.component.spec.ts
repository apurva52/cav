import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLayoutGridComponent } from './dashboard-layout-grid.component';

describe('DashboardLayoutGridComponent', () => {
  let component: DashboardLayoutGridComponent;
  let fixture: ComponentFixture<DashboardLayoutGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardLayoutGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLayoutGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
