import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterByFavoriteComponent } from './filter-by-favorite.component';

describe('FilterByFavoriteComponent', () => {
  let component: FilterByFavoriteComponent;
  let fixture: ComponentFixture<FilterByFavoriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterByFavoriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterByFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
