import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonStatsFilterComponent } from './common-stats-filter.component';

describe('CommonStatsFilterComponent', () => {
  let component: CommonStatsFilterComponent;
  let fixture: ComponentFixture<CommonStatsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonStatsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonStatsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
