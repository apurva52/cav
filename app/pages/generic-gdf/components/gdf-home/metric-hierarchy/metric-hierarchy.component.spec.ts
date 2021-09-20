import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricHierarchyComponent } from './metric-hierarchy.component';

describe('MetricHierarchyComponent', () => {
  let component: MetricHierarchyComponent;
  let fixture: ComponentFixture<MetricHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
