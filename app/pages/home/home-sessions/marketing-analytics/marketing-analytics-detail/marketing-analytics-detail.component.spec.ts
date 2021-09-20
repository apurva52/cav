import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingAnalyticsDetailComponent } from './marketing-analytics-detail.component';

describe('MarketingAnalyticsDetailComponent', () => {
  let component: MarketingAnalyticsDetailComponent;
  let fixture: ComponentFixture<MarketingAnalyticsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingAnalyticsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingAnalyticsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
