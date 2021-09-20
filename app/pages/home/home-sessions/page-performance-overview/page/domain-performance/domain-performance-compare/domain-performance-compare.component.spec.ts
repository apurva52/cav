import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainPerformanceCompareComponent } from './domain-performance-compare.component';

describe('DomainPerformanceCompareComponent', () => {
  let component: DomainPerformanceCompareComponent;
  let fixture: ComponentFixture<DomainPerformanceCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainPerformanceCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainPerformanceCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
