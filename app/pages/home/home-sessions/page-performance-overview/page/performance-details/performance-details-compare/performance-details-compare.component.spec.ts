import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceDetailsCompareComponent } from './performance-details-compare.component';

describe('PerformanceDetailsCompareComponent', () => {
  let component: PerformanceDetailsCompareComponent;
  let fixture: ComponentFixture<PerformanceDetailsCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceDetailsCompareComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceDetailsCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
