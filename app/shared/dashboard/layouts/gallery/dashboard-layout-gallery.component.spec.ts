import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLayoutGalleryComponent } from './dashboard-layout-gallery.component';

describe('DashboardLayoutGalleryComponent', () => {
  let component: DashboardLayoutGalleryComponent;
  let fixture: ComponentFixture<DashboardLayoutGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardLayoutGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLayoutGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
