import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalDrilldownFilterComponent } from './global-drilldown-filter.component';

describe('GlobalDrilldownFilterComponent', () => {
  let component: GlobalDrilldownFilterComponent;
  let fixture: ComponentFixture<GlobalDrilldownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalDrilldownFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalDrilldownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
