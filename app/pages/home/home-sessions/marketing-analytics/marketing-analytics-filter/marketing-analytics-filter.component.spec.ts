import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingAnalyticsFilterComponent } from './marketing-analytics-filter.component';

describe('MarketingAnalyticsFilterComponent', () => {
  let component: MarketingAnalyticsFilterComponent;
  let fixture: ComponentFixture<MarketingAnalyticsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingAnalyticsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingAnalyticsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
