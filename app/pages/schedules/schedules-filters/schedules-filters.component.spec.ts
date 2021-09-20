import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesFiltersComponent } from './schedules-filters.component';

describe('SchedulesFiltersComponent', () => {
  let component: SchedulesFiltersComponent;
  let fixture: ComponentFixture<SchedulesFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulesFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
