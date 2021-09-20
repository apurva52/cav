import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTierComponentViewComponent } from './business-tier-component-view.component';

describe('BusinessTierComponentViewComponent', () => {
  let component: BusinessTierComponentViewComponent;
  let fixture: ComponentFixture<BusinessTierComponentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessTierComponentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTierComponentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
