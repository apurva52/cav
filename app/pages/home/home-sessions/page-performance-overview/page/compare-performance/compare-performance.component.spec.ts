import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparePerformanceComponent } from './compare-performance.component';

describe('ComparePerformanceComponent', () => {
  let component: ComparePerformanceComponent;
  let fixture: ComponentFixture<ComparePerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparePerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
