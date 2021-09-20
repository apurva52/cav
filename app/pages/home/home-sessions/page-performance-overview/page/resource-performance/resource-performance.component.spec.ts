import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePerformanceComponent } from './resource-performance.component';

describe('ResourcePerformanceComponent', () => {
  let component: ResourcePerformanceComponent;
  let fixture: ComponentFixture<ResourcePerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcePerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
