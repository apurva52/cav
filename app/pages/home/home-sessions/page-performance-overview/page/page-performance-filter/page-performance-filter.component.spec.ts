import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePerformanceFilterComponent } from './page-performance-filter.component';

describe('PagePerformanceFilterComponent', () => {
  let component: PagePerformanceFilterComponent;
  let fixture: ComponentFixture<PagePerformanceFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePerformanceFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePerformanceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
