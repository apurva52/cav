import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainPerformanceComponent } from './domain-performance.component';

describe('DomainPerformanceComponent', () => {
  let component: DomainPerformanceComponent;
  let fixture: ComponentFixture<DomainPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
