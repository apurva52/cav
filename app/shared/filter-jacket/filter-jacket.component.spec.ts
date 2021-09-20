import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterJacketComponent } from './filter-jacket.component';

describe('FilterJacketComponent', () => {
  let component: FilterJacketComponent;
  let fixture: ComponentFixture<FilterJacketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterJacketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterJacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
