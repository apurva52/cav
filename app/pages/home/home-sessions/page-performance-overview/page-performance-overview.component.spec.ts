import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePerformanceOverviewComponent } from './page-performance-overview.component';

describe('PagePerformanceOverviewComponent', () => {
  let component: PagePerformanceOverviewComponent;
  let fixture: ComponentFixture<PagePerformanceOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePerformanceOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePerformanceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
