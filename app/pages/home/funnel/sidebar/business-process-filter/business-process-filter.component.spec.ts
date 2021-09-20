import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProcessFilterComponent } from './business-process-filter.component';

describe('BusinessProcessFilterComponent', () => {
  let component: BusinessProcessFilterComponent;
  let fixture: ComponentFixture<BusinessProcessFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessProcessFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProcessFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
