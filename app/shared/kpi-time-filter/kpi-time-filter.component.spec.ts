import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTimeFilterComponent } from './kpi-time-filter.component';

describe('KpiTimeFilterComponent', () => {
  let component: KpiTimeFilterComponent;
  let fixture: ComponentFixture<KpiTimeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiTimeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiTimeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
