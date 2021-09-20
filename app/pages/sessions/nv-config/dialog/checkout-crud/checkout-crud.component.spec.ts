import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCrudComponent } from './checkout-crud.component';

describe('CheckoutCrudComponent', () => {
  let component: CheckoutCrudComponent;
  let fixture: ComponentFixture<CheckoutCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
