import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregatedVirtualMetricesComponent } from './aggregated-virtual-metrices.component';

describe('AggregatedVirtualMetricesComponent', () => {
  let component: AggregatedVirtualMetricesComponent;
  let fixture: ComponentFixture<AggregatedVirtualMetricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregatedVirtualMetricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregatedVirtualMetricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
