import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialReportsFilterComponent } from './special-reports-filter.component';

describe('SpecialReportsFilterComponent', () => {
  let component: SpecialReportsFilterComponent;
  let fixture: ComponentFixture<SpecialReportsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialReportsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialReportsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
