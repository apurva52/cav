import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnalyticsFilterComponent } from './form-analytics-filter.component';

describe('FormAnalyticsFilterComponent', () => {
  let component: FormAnalyticsFilterComponent;
  let fixture: ComponentFixture<FormAnalyticsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAnalyticsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnalyticsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
