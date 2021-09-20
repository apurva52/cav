import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdrChartComponent } from './ddr-chart.component';

describe('DdrChartComponent', () => {
  let component: DdrChartComponent;
  let fixture: ComponentFixture<DdrChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdrChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdrChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
