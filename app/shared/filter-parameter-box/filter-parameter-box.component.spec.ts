import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterParameterBoxComponent } from './filter-parameter-box.component';

describe('ConfigureIndexPatternComponent', () => {
  let component: FilterParameterBoxComponent;
  let fixture: ComponentFixture<FilterParameterBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterParameterBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterParameterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
