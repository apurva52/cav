import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFavListComponent } from './dashboard-fav-list.component';

describe('DashboardFavListComponent', () => {
  let component: DashboardFavListComponent;
  let fixture: ComponentFixture<DashboardFavListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFavListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
