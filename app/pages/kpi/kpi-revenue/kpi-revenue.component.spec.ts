import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiRevenueComponent } from './kpi-revenue.component';

describe('KpiRevenueComponent', () => {
  let component: KpiRevenueComponent;
  let fixture: ComponentFixture<KpiRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KpiRevenueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
