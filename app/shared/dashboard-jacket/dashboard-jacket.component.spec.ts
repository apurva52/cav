import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardJacketComponent } from './dashboard-jacket.component';

describe('DashboardJacketComponent', () => {
  let component: DashboardJacketComponent;
  let fixture: ComponentFixture<DashboardJacketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardJacketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardJacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
