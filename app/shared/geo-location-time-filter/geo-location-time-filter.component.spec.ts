import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoLocationTimeFilterComponent } from './geo-location-time-filter.component';

describe('GeoLocationTimeFilterComponent', () => {
  let component: GeoLocationTimeFilterComponent;
  let fixture: ComponentFixture<GeoLocationTimeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoLocationTimeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoLocationTimeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
