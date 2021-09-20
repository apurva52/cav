import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrilldownFilterComponent } from './drilldown-filter.component';

describe('DrilldownFilterComponent', () => {
  let component: DrilldownFilterComponent;
  let fixture: ComponentFixture<DrilldownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrilldownFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrilldownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
