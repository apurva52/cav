import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesFilterComponent } from './indices-filter.component';

describe('IndicesFilterComponent', () => {
  let component: IndicesFilterComponent;
  let fixture: ComponentFixture<IndicesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
