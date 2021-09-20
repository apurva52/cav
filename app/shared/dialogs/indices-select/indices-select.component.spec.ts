import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesSelectComponent } from './indices-select.component';

describe('IndicesSelectComponent', () => {
  let component: IndicesSelectComponent;
  let fixture: ComponentFixture<IndicesSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
