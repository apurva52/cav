import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivedMetricIndicesComponent } from './derived-metric-indices.component';

describe('DerivedMetricIndicesComponent', () => {
  let component: DerivedMetricIndicesComponent;
  let fixture: ComponentFixture<DerivedMetricIndicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DerivedMetricIndicesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedMetricIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
