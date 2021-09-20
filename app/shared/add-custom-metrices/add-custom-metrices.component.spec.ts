import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomMetricesComponent } from './add-custom-metrices.component';

describe('AddCustomMetricesComponent', () => {
  let component: AddCustomMetricesComponent;
  let fixture: ComponentFixture<AddCustomMetricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomMetricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomMetricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
