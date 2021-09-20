import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewVariationComponent } from './add-new-variation.component';

describe('AddNewVariationComponent', () => {
  let component: AddNewVariationComponent;
  let fixture: ComponentFixture<AddNewVariationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewVariationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
