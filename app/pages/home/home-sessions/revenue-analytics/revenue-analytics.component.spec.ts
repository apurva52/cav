import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueAnalyticsComponent } from './revenue-analytics.component';

describe('RevenueAnalyticsComponent', () => {
  let component: RevenueAnalyticsComponent;
  let fixture: ComponentFixture<RevenueAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
