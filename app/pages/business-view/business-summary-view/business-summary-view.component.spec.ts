import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSummaryViewComponent } from './business-summary-view.component';

describe('BusinessSummaryViewComponent', () => {
  let component: BusinessSummaryViewComponent;
  let fixture: ComponentFixture<BusinessSummaryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessSummaryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessSummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
