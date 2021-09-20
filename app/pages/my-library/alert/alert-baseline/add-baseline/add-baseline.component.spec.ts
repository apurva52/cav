import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBaselineComponent } from './add-baseline.component';

describe('AddBaselineComponent', () => {
  let component: AddBaselineComponent;
  let fixture: ComponentFixture<AddBaselineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBaselineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBaselineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
