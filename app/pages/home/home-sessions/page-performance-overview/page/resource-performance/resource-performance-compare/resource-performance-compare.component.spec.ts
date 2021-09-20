import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePerformanceCompareComponent } from './resource-performance-compare.component';

describe('ResourcePerformanceCompareComponent', () => {
  let component: ResourcePerformanceCompareComponent;
  let fixture: ComponentFixture<ResourcePerformanceCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcePerformanceCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePerformanceCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
