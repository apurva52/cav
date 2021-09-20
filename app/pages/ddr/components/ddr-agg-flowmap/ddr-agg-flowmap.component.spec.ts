import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdrAggFlowmapComponent } from './ddr-agg-flowmap.component';

describe('DdrAggFlowmapComponent', () => {
  let component: DdrAggFlowmapComponent;
  let fixture: ComponentFixture<DdrAggFlowmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdrAggFlowmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdrAggFlowmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
