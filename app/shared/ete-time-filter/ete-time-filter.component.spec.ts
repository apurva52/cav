import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EteTimeFilterComponent } from './ete-time-filter.component';

describe('EteTimeFilterComponent', () => {
  let component: EteTimeFilterComponent;
  let fixture: ComponentFixture<EteTimeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EteTimeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EteTimeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
