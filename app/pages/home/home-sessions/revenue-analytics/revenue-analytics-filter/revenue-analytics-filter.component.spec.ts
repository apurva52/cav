import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueAnalyticsFilterComponent } from './revenue-analytics-filter.component';

describe('RevenueAnalyticsFilterComponent', () => {
  let component: RevenueAnalyticsFilterComponent;
  let fixture: ComponentFixture<RevenueAnalyticsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueAnalyticsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueAnalyticsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
